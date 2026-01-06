import { useState, useCallback } from 'react';
import { LayoutPage } from '@/types';

export const usePageManagement = () => {
    const [pages, setPages] = useState<LayoutPage[]>([
        { id: 'page-0-0', name: 'Page 1', tables: [], gridPosition: { row: 0, col: 0 } }
    ]);
    const [currentPageId, setCurrentPageId] = useState('page-0-0');
    const [lastAddDirection, setLastAddDirection] = useState<'horizontal' | 'vertical' | null>(null);

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

    const handlePageAdd = useCallback(() => {
        const sourcePage = pages.find(p => p.id === currentPageId);
        if (!sourcePage) return;

        const { row, col } = sourcePage.gridPosition;
        let targetPositions: { row: number; col: number }[] = [];

        // 추가 방향 결정
        if (lastAddDirection === null) {
            // 첫 클릭: 가로 추가
            targetPositions.push({ row, col: col + 1 });
            setLastAddDirection('horizontal');
        } else if (lastAddDirection === 'horizontal') {
            // 두 번째 클릭: 세로 추가
            targetPositions.push({ row: row + 1, col });
            setLastAddDirection('vertical');
        } else {
            // 세 번째 클릭: 대각선 추가
            targetPositions.push({ row: row + 1, col: col + 1 });
            setLastAddDirection(null);
        }

        // 이미 존재하는 페이지인지 확인
        const firstTarget = targetPositions[0];
        const existingPage = getPageAt(firstTarget.row, firstTarget.col);
        if (existingPage) {
            setCurrentPageId(existingPage.id);
            return;
        }

        setPages(prev => {
            const newPages = [...prev];

            // 모든 타겟 포지션 포함하도록 bounds 확장
            const allRows = [...newPages.map(p => p.gridPosition.row), ...targetPositions.map(t => t.row)];
            const allCols = [...newPages.map(p => p.gridPosition.col), ...targetPositions.map(t => t.col)];

            const expandedMinRow = Math.min(...allRows);
            const expandedMaxRow = Math.max(...allRows);
            const expandedMinCol = Math.min(...allCols);
            const expandedMaxCol = Math.max(...allCols);

            // 빈 공간 채우기
            for (let r = expandedMinRow; r <= expandedMaxRow; r++) {
                for (let c = expandedMinCol; c <= expandedMaxCol; c++) {
                    const existing = newPages.find(p => p.gridPosition.row === r && p.gridPosition.col === c);
                    if (!existing) {
                        const pageId = `page-${r}-${c}`;
                        const pageNumber = newPages.length + 1;
                        newPages.push({
                            id: pageId,
                            name: `Page ${pageNumber}`,
                            tables: [],
                            gridPosition: { row: r, col: c }
                        });
                    }
                }
            }

            return newPages;
        });

        setCurrentPageId(`page-${firstTarget.row}-${firstTarget.col}`);
    }, [pages, currentPageId, getPageAt, lastAddDirection]);

    const handlePageDelete = useCallback(() => {
        if (pages.length <= 1) return;

        setPages(prev => {
            const bounds = getGridBounds();

            let pageToDelete: LayoutPage | undefined;

            pageToDelete = prev.find(p => p.gridPosition.row === bounds.maxRow && p.gridPosition.col === bounds.maxCol);

            if (!pageToDelete) {
                pageToDelete = prev.find(p => p.gridPosition.row === bounds.minRow && p.gridPosition.col === bounds.maxCol);
            }

            if (!pageToDelete) {
                pageToDelete = prev.find(p => p.gridPosition.row === bounds.maxRow && p.gridPosition.col === bounds.minCol);
            }

            if (!pageToDelete) {
                pageToDelete = prev[prev.length - 1];
            }

            if (!pageToDelete) return prev;

            const filtered = prev.filter(p => p.id !== pageToDelete.id);

            if (currentPageId === pageToDelete.id && filtered.length > 0) {
                setCurrentPageId(filtered[0].id);
            }

            return filtered;
        });
    }, [pages, currentPageId, getGridBounds]);

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
