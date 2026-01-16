import { useCallback } from 'react';
import { PlacedTable, TableType, UseTableManagementProps } from '@/types';

export const useTableManagement = ({ pages, setPages, currentPageId }: UseTableManagementProps) => {
    const updatePageTables = useCallback((pageId: string, updater: (tables: PlacedTable[]) => PlacedTable[]) => {
        setPages(prev =>
            prev.map(page =>
                page.id === pageId
                    ? { ...page, tables: updater(page.tables) }
                    : page
            )
        );
    }, [setPages]);

    const handleAddTable = useCallback((type: TableType, position: { x: number; y: number }, targetPageId?: string) => {
        const pageId = targetPageId || currentPageId;
        const newTable: PlacedTable = {
            id: `table-${Date.now()}`,
            type,
            position
        };
        updatePageTables(pageId, tables => [...tables, newTable]);
    }, [currentPageId, updatePageTables]);

    const handleMoveTable = useCallback((tableId: string, position: { x: number; y: number }, sourcePageId?: string, targetPageId?: string) => {
        const source = sourcePageId || currentPageId;
        const target = targetPageId || currentPageId;

        if (source === target) {
            updatePageTables(target, tables =>
                tables.map(table =>
                    table.id === tableId ? { ...table, position } : table
                )
            );
        } else {
            setPages(prev => {
                const sourcePage = prev.find(p => p.id === source);
                const tableToMove = sourcePage?.tables.find(t => t.id === tableId);

                if (!tableToMove) return prev;

                return prev.map(page => {
                    if (page.id === source) {
                        return { ...page, tables: page.tables.filter(t => t.id !== tableId) };
                    } else if (page.id === target) {
                        return { ...page, tables: [...page.tables, { ...tableToMove, position }] };
                    }
                    return page;
                });
            });
        }
    }, [currentPageId, updatePageTables, pages, setPages]);

    const handleRemoveTable = useCallback((tableId: string, targetPageId?: string) => {
        const pageId = targetPageId || currentPageId;
        updatePageTables(pageId, tables => tables.filter(table => table.id !== tableId));
    }, [currentPageId, updatePageTables]);

    const handleSetTableNumber = useCallback((tableId: string, tableNumber: string, targetPageId?: string) => {
        const pageId = targetPageId || currentPageId;
        updatePageTables(pageId, tables =>
            tables.map(table =>
                table.id === tableId ? { ...table, tableNumber } : table
            )
        );
    }, [currentPageId, updatePageTables]);

    const handleRotateTable = useCallback((tableId: string, targetPageId?: string) => {
        const pageId = targetPageId || currentPageId;
        updatePageTables(pageId, tables =>
            tables.map(table =>
                table.id === tableId
                    ? { ...table, rotation: ((table.rotation || 0) + 90) % 360 }
                    : table
            )
        );
    }, [currentPageId, updatePageTables]);

    const handleReorderTables = useCallback((reorderedTables: PlacedTable[]) => {
        updatePageTables(currentPageId, () => reorderedTables);
    }, [currentPageId, updatePageTables]);

    return {
        handleAddTable,
        handleMoveTable,
        handleRemoveTable,
        handleSetTableNumber,
        handleRotateTable,
        handleReorderTables
    };
};
