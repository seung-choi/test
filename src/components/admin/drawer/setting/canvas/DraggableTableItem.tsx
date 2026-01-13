'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/draggableTableItem.module.scss';
import { PlacedTable } from '@/types';
import TableShape from '@/components/common/TableShape';
import { isPositionValid, getTableDimensions } from '@/utils/tableCollision';
import { useClickOutside } from '@/hooks/common/useClickOutside';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface DraggableTableItemProps {
    table: PlacedTable;
    onMove: (tableId: string, position: { x: number; y: number }) => void;
    onRemove: (tableId: string) => void;
    onSetTableNumber: (tableId: string, tableNumber: string) => void;
    onRotate: (tableId: string) => void;
    placedTables: PlacedTable[];
    pageId?: string;
    availableTableNumbers: string[];
}

const DraggableTableItem: React.FC<DraggableTableItemProps> = ({
    table,
    onMove,
    onRemove,
    onSetTableNumber,
    onRotate,
    placedTables,
    availableTableNumbers
}) => {
    const [isSelected, setIsSelected] = useState(false);
    const [showNumberDropdown, setShowNumberDropdown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);
    const tableStartPos = useRef<{ x: number; y: number } | null>(null);

    const borderColor = '#7B7B7B';

    useClickOutside(itemRef, () => {
        setIsSelected(false);
        setShowNumberDropdown(false);
    });

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragStartPos.current || !tableStartPos.current) return;

            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;

            let newX = tableStartPos.current.x + deltaX;
            let newY = tableStartPos.current.y + deltaY;

            const dimensions = getTableDimensions(table);
            newX = Math.max(0, Math.min(CANVAS_WIDTH - dimensions.width, newX));
            newY = Math.max(0, Math.min(CANVAS_HEIGHT - dimensions.height, newY));

            setTempPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            if (tempPosition) {
                if (isPositionValid(table, tempPosition, placedTables)) {
                    onMove(table.id, tempPosition);
                } else {
                    onMove(table.id, tableStartPos.current!);
                }
            }
            setIsDragging(false);
            setTempPosition(null);
            dragStartPos.current = null;
            tableStartPos.current = null;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, table, placedTables, onMove, tempPosition]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest(`.${styles.controlPanel}`) || target.closest(`.${styles.numberDropdown}`)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setShowNumberDropdown(false);

        dragStartPos.current = { x: e.clientX, y: e.clientY };
        tableStartPos.current = { x: table.position.x, y: table.position.y };
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) return;

        const target = e.target as HTMLElement;
        if (target.closest(`.${styles.controlPanel}`) || target.closest(`.${styles.numberDropdown}`)) {
            return;
        }

        e.stopPropagation();
        setIsSelected(!isSelected);
        setShowNumberDropdown(false);
    };

    const handleNumberAssign = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowNumberDropdown(!showNumberDropdown);
    };

    const handleNumberSelect = (number: string) => {
        onSetTableNumber(table.id, number);
        setShowNumberDropdown(false);
        setIsSelected(false);
    };

    const handleRotate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRotate(table.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(table.id);
    };

    const normalizeNumber = (value: string) => (value.endsWith('번') ? value.slice(0, -1) : value);
    const formatNumber = (value: string) => (value.endsWith('번') ? value : `${value}번`);

    const getUsedNumbers = () => {
        return placedTables
            .filter(t => t.id !== table.id && t.tableNumber)
            .map(t => normalizeNumber(t.tableNumber!));
    };

    const usedNumbers = getUsedNumbers();
    const availableNumbers = availableTableNumbers.map(normalizeNumber);

    const currentPosition = tempPosition || table.position;

    return (
        <div
            ref={itemRef}
            className={`${styles.tableItem} ${isDragging ? styles.dragging : ''} ${isSelected ? styles.selected : ''}`}
            style={{
                left: `${currentPosition.x}px`,
                top: `${currentPosition.y}px`,
            }}
            onClick={handleClick}
            data-table-item="true"
        >
            <div
                className={styles.tableWrapper}
                onMouseDown={handleMouseDown}
                data-table-item="true"
            >
                <TableShape
                    type={table.type}
                    borderColor={borderColor}
                    rotation={table.rotation || 0}
                    scale={table.scale || 1}
                >
                    {table.tableNumber && (
                        <div className={styles.tableNumber}>
                            {formatNumber(table.tableNumber)}
                        </div>
                    )}
                </TableShape>
            </div>

            {isSelected && (
                <div className={styles.panelWrapper}>
                    <div className={styles.controlPanel}>
                        <button className={styles.assignButton} onClick={handleNumberAssign}>
                            <img src="/assets/image/admin/setting/assign.svg" alt="assign" width={17} height={17} />
                            <span>번호 지정</span>
                        </button>
                        <button className={styles.rotateButton} onClick={handleRotate}>
                            <img src="/assets/image/admin/setting/rotate.svg" alt="rotate" width={17} height={17} />
                            <span>회전</span>
                        </button>
                        <button className={styles.deleteButton} onClick={handleDelete}>
                            <img src="/assets/image/admin/setting/delete.svg" alt="delete" width={10} height={2} />
                            <span>삭제</span>
                        </button>
                    </div>

                    {showNumberDropdown && (
                        <div className={styles.numberDropdown}>
                            <div className={styles.numberList}>
                                {availableNumbers.map((num) => {
                                    const isUsed = usedNumbers.includes(num);
                                    const isCurrent = normalizeNumber(table.tableNumber || '') === num;
                                    return (
                                        <div
                                            key={num}
                                            className={`${styles.numberItem} ${
                                                isUsed ? styles.used : ''
                                            } ${isCurrent ? styles.current : ''}`}
                                            onClick={() => !isUsed && handleNumberSelect(num)}
                                        >
                                            {formatNumber(num)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DraggableTableItem;
