'use client';

import React, { useMemo, useState } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableListView.module.scss';
import { PlacedTable, TableType } from '@/types';
import type { GetTableResponse } from '@/api/table';

interface TableWithPage extends PlacedTable {
    pageName?: string;
}

interface TableListViewProps {
    placedTables: TableWithPage[];
    tableList?: GetTableResponse[];
    onReorder?: (reorderedTables: PlacedTable[]) => void;
}

const TableListView: React.FC<TableListViewProps> = ({ placedTables, tableList, onReorder }) => {
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

    const isReorderable = Boolean(onReorder) && !tableList;

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (!isReorderable) return;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        if (!isReorderable) return;
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        if (!isReorderable) return;
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

    const isTableType = (value?: string | null): value is TableType => {
        return value === 'T4S' || value === 'T6R' || value === 'T8S' || value === 'T8R' || value === 'T10R' || value === 'T12R';
    };

    const isGetTableResponse = (table: GetTableResponse | TableWithPage): table is GetTableResponse => {
        return 'tableId' in table;
    };

    const getTableKey = (table: GetTableResponse | TableWithPage): string => {
        return isGetTableResponse(table) ? `table-${table.tableId}` : table.id;
    };

    const displayTables = useMemo(() => {
        if (!tableList) return null;
        return [...tableList].sort((a, b) => a.tableOrd - b.tableOrd);
    }, [tableList]);

    return (
        <div className={styles.listContainer}>
            {(displayTables ?? placedTables).map((table, index) => (
                <div
                    key={getTableKey(table)}
                    className={`${styles.tableCardWrapper} ${draggedIndex === index ? styles.dragging : ''} ${dragOverIndex === index ? styles.dragOver : ''}`}
                    draggable={isReorderable}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                >
                    <div className={styles.tableCard}>
                        <div className={styles.tableType}>
                            {isGetTableResponse(table)
                                ? (isTableType(table.tableCd) ? capacityMap[table.tableCd] : '미지정')
                                : capacityMap[table.type]}
                        </div>
                        <div className={styles.tableTab}>
                            <div className={styles.tableNumber}>
                                {isGetTableResponse(table)
                                    ? (table.tableNo.endsWith('번') ? table.tableNo : `${table.tableNo}번`)
                                    : (table.tableNumber
                                        ? (table.tableNumber.endsWith('번')
                                            ? table.tableNumber
                                            : `${table.tableNumber}번`)
                                        : '미지정')}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableListView;
