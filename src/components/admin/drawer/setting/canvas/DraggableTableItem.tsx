'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/draggableTableItem.module.scss';
import { PlacedTable, DragData, TableType } from '@/types/admin/layout.type';

interface DraggableTableItemProps {
    table: PlacedTable;
    onMove: (tableId: string, position: { x: number; y: number }) => void;
    onRemove: (tableId: string) => void;
    onSetTableNumber: (tableId: string, tableNumber: string) => void;
    onRotate: (tableId: string) => void;
    placedTables: PlacedTable[];
}

const baseDimensions: Record<TableType, { width: number; height: number }> = {
    '1x1': { width: 120, height: 120 },
    '1x2': { width: 120, height: 206 },
    '1x3': { width: 120, height: 292 },
    '1x4': { width: 120, height: 378 },
    '1x5': { width: 120, height: 464 },
    '2x1': { width: 206, height: 120 },
    '2x2': { width: 206, height: 206 },
    '3x1': { width: 292, height: 120 },
    '4x1': { width: 378, height: 120 },
    '5x1': { width: 464, height: 120 }
};

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

    const { width, height } = baseDimensions[table.type];
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

    const renderTableContent = () => {
        const rotation = table.rotation || 0;
        const isVertical = rotation === 90 || rotation === 270;

        const displayWidth = isVertical ? height : width;
        const displayHeight = isVertical ? width : height;

        return (
            <div
                className={styles.tableWrapper}
                style={{
                    width: displayWidth,
                    height: displayHeight,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                }}
            >
                <div
                    className={styles.innerContent}
                    style={{
                        width: width - 24,
                        height: height - 24,
                        left: 12,
                        top: 12
                    }}
                >
                    {table.tableNumber && (
                        <div className={styles.tableNumber}>{table.tableNumber}번</div>
                    )}
                </div>
                {renderBorders()}
            </div>
        );
    };

    const renderBorders = () => {
        const borders = [];
        const type = table.type;

        if (type === '1x1') {
            borders.push(
                <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98, top: height, background: borderColor }} />,
                <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            );
        } else if (type === '1x2') {
            borders.push(
                <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 96, top: height, background: borderColor }} />,
                <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />,
                <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />,
                <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
            );
        } else if (type === '2x1') {
            borders.push(
                <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />,
                <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 96, top: height, background: borderColor }} />,
                <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 182, top: height, background: borderColor }} />,
                <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            );
        } else if (type === '2x2') {
            borders.push(
                <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />,
                <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 96, top: height, background: borderColor }} />,
                <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 182, top: height, background: borderColor }} />,
                <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />,
                <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />,
                <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
            );
        } else if (type === '3x1') {
            borders.push(
                <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />,
                <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194, background: borderColor }} />,
                <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 96, top: height, background: borderColor }} />,
                <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 182, top: height, background: borderColor }} />,
                <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 268, top: height, background: borderColor }} />,
                <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            );
        } else if (type === '4x1') {
            borders.push(
                <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />,
                <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194, background: borderColor }} />,
                <div key="top4" className={`${styles.border} ${styles.borderTop}`} style={{ left: 280, background: borderColor }} />,
                <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 96, top: height, background: borderColor }} />,
                <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 182, top: height, background: borderColor }} />,
                <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 268, top: height, background: borderColor }} />,
                <div key="bottom4" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 356, top: height, background: borderColor }} />,
                <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            );
        } else if (type === '5x1') {
            borders.push(
                <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />,
                <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />,
                <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194, background: borderColor }} />,
                <div key="top4" className={`${styles.border} ${styles.borderTop}`} style={{ left: 280, background: borderColor }} />,
                <div key="top5" className={`${styles.border} ${styles.borderTop}`} style={{ left: 366, background: borderColor }} />,
                <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 96, top: height, background: borderColor }} />,
                <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 182, top: height, background: borderColor }} />,
                <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 268, top: height, background: borderColor }} />,
                <div key="bottom4" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 356, top: height, background: borderColor }} />,
                <div key="bottom5" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 444, top: height, background: borderColor }} />,
                <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />,
                <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            );
        }

        return borders;
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
            {renderTableContent()}

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
