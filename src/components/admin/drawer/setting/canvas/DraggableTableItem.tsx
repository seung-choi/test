'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/draggableTableItem.module.scss';
import { PlacedTable, DragData } from '@/types/admin/layout.type';
import TableShape from '@/components/common/TableShape';

interface DraggableTableItemProps {
    table: PlacedTable;
    onMove: (tableId: string, position: { x: number; y: number }) => void;
    onRemove: (tableId: string) => void;
    onSetTableNumber: (tableId: string, tableNumber: string) => void;
    onRotate: (tableId: string) => void;
    placedTables: PlacedTable[];
}

const DraggableTableItem: React.FC<DraggableTableItemProps> = ({
    table,
    onMove,
    onRemove,
    onSetTableNumber,
    onRotate,
    placedTables
}) => {
    const [isSelected, setIsSelected] = useState(false);
    const [showNumberDropdown, setShowNumberDropdown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    const borderColor = '#7B7B7B';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
                setIsSelected(false);
                setShowNumberDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDragStart = (e: React.DragEvent) => {
        setIsDragging(true);
        const dragData: DragData = {
            type: table.type,
            isNew: false,
            tableId: table.id
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleClick = (e: React.MouseEvent) => {
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

    const getUsedNumbers = () => {
        return placedTables
            .filter(t => t.id !== table.id && t.tableNumber)
            .map(t => t.tableNumber!);
    };

    const usedNumbers = getUsedNumbers();
    const availableNumbers = ['1', '2', '3', '4', '5', '6', '7'];

    return (
        <div
            ref={itemRef}
            className={`${styles.tableItem} ${isDragging ? styles.dragging : ''}`}
            style={{
                left: `${table.position.x}px`,
                top: `${table.position.y}px`,
            }}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
        >
            <TableShape
                type={table.type}
                borderColor={borderColor}
                rotation={table.rotation || 0}
            >
                {table.tableNumber && (
                    <div className={styles.tableNumber}>{table.tableNumber}번</div>
                )}
            </TableShape>

            {isSelected && !showNumberDropdown && (
                <div className={styles.controlPanel}>
                    <button className={styles.assignButton} onClick={handleNumberAssign}>
                        <img src="/assets/image/admin/setting/assign.svg" alt="assign" />
                        <span>번호 지정</span>
                    </button>
                    <button className={styles.rotateButton} onClick={handleRotate}>
                        <img src="/assets/image/admin/setting/rotate.svg" alt="rotate" />
                        <span>회전</span>
                    </button>
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        <img src="/assets/image/admin/setting/delete.svg" alt="delete" />
                        <span>삭제</span>
                    </button>
                </div>
            )}

            {showNumberDropdown && (
                <div className={styles.numberDropdown}>
                    <div className={styles.numberList}>
                        {availableNumbers.map((num) => {
                            const isUsed = usedNumbers.includes(num);
                            const isCurrent = table.tableNumber === num;
                            return (
                                <div
                                    key={num}
                                    className={`${styles.numberItem} ${
                                        isUsed ? styles.used : ''
                                    } ${isCurrent ? styles.current : ''}`}
                                    onClick={() => !isUsed && handleNumberSelect(num)}
                                >
                                    {num}번
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.scrollbar} />
                </div>
            )}
        </div>
    );
};

export default DraggableTableItem;
