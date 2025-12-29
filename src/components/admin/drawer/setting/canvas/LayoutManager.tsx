'use client';

import React, { useState, useCallback } from 'react';
import TableSelector from './TableSelector';
import LayoutCanvas from './LayoutCanvas';
import TableNumberList from './TableNumberList';
import LayoutTabs from './LayoutTabs';
import TableListView from './TableListView';
import styles from '@/styles/components/admin/drawer/canvas/layoutManager.module.scss';
import { PlacedTable, TableType } from '@/types/admin/layout.type';

const LayoutManager: React.FC = () => {
    const [placedTables, setPlacedTables] = useState<PlacedTable[]>([]);
    const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');

    const handleAddTable = useCallback((type: TableType, position: { x: number; y: number }) => {
        const newTable: PlacedTable = {
            id: `table-${Date.now()}`,
            type,
            position
        };
        setPlacedTables(prev => [...prev, newTable]);
    }, []);

    const handleMoveTable = useCallback((tableId: string, position: { x: number; y: number }) => {
        setPlacedTables(prev =>
            prev.map(table =>
                table.id === tableId ? { ...table, position } : table
            )
        );
    }, []);

    const handleRemoveTable = useCallback((tableId: string) => {
        setPlacedTables(prev => prev.filter(table => table.id !== tableId));
    }, []);

    const handleSetTableNumber = useCallback((tableId: string, tableNumber: string) => {
        setPlacedTables(prev =>
            prev.map(table =>
                table.id === tableId ? { ...table, tableNumber } : table
            )
        );
    }, []);

    const handleRotateTable = useCallback((tableId: string) => {
        setPlacedTables(prev =>
            prev.map(table =>
                table.id === tableId
                    ? { ...table, rotation: ((table.rotation || 0) + 90) % 360 }
                    : table
            )
        );
    }, []);

    const handleReorderTables = useCallback((reorderedTables: PlacedTable[]) => {
        setPlacedTables(reorderedTables);
    }, []);

    return (
        <div className={styles.container}>
            <TableSelector />
            <div className={styles.canvasWrapper}>
                <LayoutTabs activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === 'table' ? (
                    <LayoutCanvas
                        placedTables={placedTables}
                        onAddTable={handleAddTable}
                        onMoveTable={handleMoveTable}
                        onRemoveTable={handleRemoveTable}
                        onSetTableNumber={handleSetTableNumber}
                        onRotateTable={handleRotateTable}
                    />
                ) : (
                    <TableListView
                        placedTables={placedTables}
                        onReorder={handleReorderTables}
                    />
                )}
            </div>
            <TableNumberList />
        </div>
    );
};

export default LayoutManager;
