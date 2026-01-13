import { useState, useCallback } from 'react';
import { LayoutPage } from '@/types';

export const usePageManagement = () => {
    const [pages, setPages] = useState<LayoutPage[]>([
        { id: 'page-0-0', name: 'Page 1', tables: [], gridPosition: { row: 0, col: 0 } }
    ]);
    const [currentPageId, setCurrentPageId] = useState('page-0-0');

    const getGridBounds = useCallback(() => {
        if (pages.length === 0) return { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0 };

        const rows = pages.map(p => p.gridPosition.row);
        const cols = pages.map(p => p.gridPosition.col);

        return {
            minRow: Math.min(...rows),
            maxRow: Math.max(...rows),
            minCol: Math.min(...cols),
            maxCol: Math.max(...cols)
        };
    }, [pages]);

    const getPageAt = useCallback((row: number, col: number): LayoutPage | undefined => {
        return pages.find(p => p.gridPosition.row === row && p.gridPosition.col === col);
    }, [pages]);

    const handlePageAdd = useCallback((direction: 'right' | 'bottom' | 'left' | 'top') => {
        const sourcePage = pages.find(p => p.id === currentPageId);
        if (!sourcePage) return;

        const { row, col } = sourcePage.gridPosition;
        let targetRow = row;
        let targetCol = col;

        switch (direction) {
            case 'right':
                targetCol = col + 1;
                break;
            case 'bottom':
                targetRow = row + 1;
                break;
            case 'left':
                targetCol = col - 1;
                break;
            case 'top':
                targetRow = row - 1;
                break;
        }

        const existingPage = getPageAt(targetRow, targetCol);
        if (existingPage) {
            setCurrentPageId(existingPage.id);
            return;
        }

        setPages(prev => {
            const newPages = [...prev];
            const pageId = `page-${targetRow}-${targetCol}`;
            const pageNumber = newPages.length + 1;

            newPages.push({
                id: pageId,
                name: `Page ${pageNumber}`,
                tables: [],
                gridPosition: { row: targetRow, col: targetCol }
            });

            return newPages;
        });

        setCurrentPageId(`page-${targetRow}-${targetCol}`);
    }, [pages, currentPageId, getPageAt]);

    const handlePageDelete = useCallback((pageId?: string) => {
        if (pages.length <= 1) return;

        setPages(prev => {
            const targetPageId = pageId || currentPageId;
            const filtered = prev.filter(p => p.id !== targetPageId);

            if (currentPageId === targetPageId && filtered.length > 0) {
                setCurrentPageId(filtered[0].id);
            }

            return filtered;
        });
    }, [pages, currentPageId]);

    const handlePageSelect = useCallback((pageId: string) => {
        setCurrentPageId(pageId);
    }, []);

    return {
        pages,
        setPages,
        currentPageId,
        getGridBounds,
        getPageAt,
        handlePageAdd,
        handlePageDelete,
        handlePageSelect
    };
};
