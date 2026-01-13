'use client';

import React, { useState } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableListView.module.scss';
import { PlacedTable, TableType } from '@/types';

interface TableWithPage extends PlacedTable {
    pageName?: string;
}

interface TableListViewProps {
    placedTables: TableWithPage[];
    onReorder?: (reorderedTables: PlacedTable[]) => void;
}

const TableListView: React.FC<TableListViewProps> = ({ placedTables, onReorder }) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const capacityMap: Record<TableType, string> = {
        T4S: '4인',
        T6R: '6인',
        T8S: '8인',
        T8R: '8인',
        T10R: '10인',
        T12R: '12인'
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const reorderedTables = [...placedTables];
        const [draggedItem] = reorderedTables.splice(draggedIndex, 1);
        reorderedTables.splice(dropIndex, 0, draggedItem);

        onReorder?.(reorderedTables);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className={styles.listContainer}>
            {placedTables.map((table, index) => (
                <div
                    key={table.id}
                    className={`${styles.tableCardWrapper} ${draggedIndex === index ? styles.dragging : ''} ${dragOverIndex === index ? styles.dragOver : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                >
                    <div className={styles.tableCard}>
                        <div className={styles.tableType}>{capacityMap[table.type]}</div>
                        <div className={styles.tableTab}>
                            <div className={styles.tableNumber}>
                                {table.tableNumber
                                    ? (table.tableNumber.endsWith('번')
                                        ? table.tableNumber
                                        : `${table.tableNumber}번`)
                                    : '미지정'}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableListView;
