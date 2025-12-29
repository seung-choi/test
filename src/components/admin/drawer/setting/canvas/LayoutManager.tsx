'use client';

import React, { useState, useCallback } from 'react';
import TableSelector from './TableSelector';
import LayoutCanvas from './LayoutCanvas';
import TableNumberList from './TableNumberList';
import LayoutTabs from './LayoutTabs';
import TableListView from './TableListView';
import PageNavigation from './PageNavigation';
import styles from '@/styles/components/admin/drawer/canvas/layoutManager.module.scss';
import { PlacedTable, TableType, LayoutPage } from '@/types/admin/layout.type';

const LayoutManager: React.FC = () => {
    const [pages, setPages] = useState<LayoutPage[]>([
        { id: 'page-1', name: 'Page 1', tables: [] }
    ]);
    const [currentPageId, setCurrentPageId] = useState('page-1');
    const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');

    const currentPage = pages.find(p => p.id === currentPageId);
    const placedTables = currentPage?.tables || [];

    const updateCurrentPageTables = useCallback((updater: (tables: PlacedTable[]) => PlacedTable[]) => {
        setPages(prev =>
            prev.map(page =>
                page.id === currentPageId
                    ? { ...page, tables: updater(page.tables) }
                    : page
            )
        );
    }, [currentPageId]);

    const handleAddTable = useCallback((type: TableType, position: { x: number; y: number }) => {
        const newTable: PlacedTable = {
            id: `table-${Date.now()}`,
            type,
            position
        };
        updateCurrentPageTables(tables => [...tables, newTable]);
    }, [updateCurrentPageTables]);

    const handleMoveTable = useCallback((tableId: string, position: { x: number; y: number }) => {
        updateCurrentPageTables(tables =>
            tables.map(table =>
                table.id === tableId ? { ...table, position } : table
            )
        );
    }, [updateCurrentPageTables]);

    const handleRemoveTable = useCallback((tableId: string) => {
        updateCurrentPageTables(tables => tables.filter(table => table.id !== tableId));
    }, [updateCurrentPageTables]);

    const handleSetTableNumber = useCallback((tableId: string, tableNumber: string) => {
        updateCurrentPageTables(tables =>
            tables.map(table =>
                table.id === tableId ? { ...table, tableNumber } : table
            )
        );
    }, [updateCurrentPageTables]);

    const handleRotateTable = useCallback((tableId: string) => {
        updateCurrentPageTables(tables =>
            tables.map(table =>
                table.id === tableId
                    ? { ...table, rotation: ((table.rotation || 0) + 90) % 360 }
                    : table
            )
        );
    }, [updateCurrentPageTables]);

    const handleReorderTables = useCallback((reorderedTables: PlacedTable[]) => {
        updateCurrentPageTables(() => reorderedTables);
    }, [updateCurrentPageTables]);

    const handlePageAdd = useCallback(() => {
        const newPageId = `page-${Date.now()}`;
        const newPage: LayoutPage = {
            id: newPageId,
            name: `Page ${pages.length + 1}`,
            tables: []
        };
        setPages(prev => [...prev, newPage]);
        setCurrentPageId(newPageId);
    }, [pages.length]);

    const handlePageDelete = useCallback((pageId: string) => {
        if (pages.length <= 1) return;

        setPages(prev => {
            const filtered = prev.filter(p => p.id !== pageId);
            if (currentPageId === pageId) {
                setCurrentPageId(filtered[0].id);
            }
            return filtered;
        });
    }, [pages.length, currentPageId]);

    const handlePageSelect = useCallback((pageId: string) => {
        setCurrentPageId(pageId);
    }, []);

    return (
        <div className={styles.container}>
            <PageNavigation
                pages={pages}
                currentPageId={currentPageId}
                onPageSelect={handlePageSelect}
                onPageAdd={handlePageAdd}
                onPageDelete={handlePageDelete}
            />
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
