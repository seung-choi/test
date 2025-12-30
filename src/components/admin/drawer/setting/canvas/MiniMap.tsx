'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/miniMap.module.scss';
import { LayoutPage } from '@/types';

interface MiniMapProps {
    pages: LayoutPage[];
    currentPageId: string;
    onPageSelect: (pageId: string) => void;
    onPageDelete?: (pageId: string) => void;
}

const MiniMap: React.FC<MiniMapProps> = ({
    pages,
    currentPageId,
    onPageSelect,
    onPageDelete
}) => {
    // 그리드 범위 계산
    const getGridBounds = () => {
        if (pages.length === 0) return { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0 };

        const rows = pages.map(p => p.gridPosition.row);
        const cols = pages.map(p => p.gridPosition.col);

        return {
            minRow: Math.min(...rows),
            maxRow: Math.max(...rows),
            minCol: Math.min(...cols),
            maxCol: Math.max(...cols)
        };
    };

    const getPageAt = (row: number, col: number): LayoutPage | undefined => {
        return pages.find(p => p.gridPosition.row === row && p.gridPosition.col === col);
    };

    const bounds = getGridBounds();
    const gridRows: JSX.Element[] = [];

    for (let r = bounds.minRow; r <= bounds.maxRow; r++) {
        const cols: JSX.Element[] = [];

        for (let c = bounds.minCol; c <= bounds.maxCol; c++) {
            const page = getPageAt(r, c);

            if (page) {
                const isActive = page.id === currentPageId;
                const tableCount = page.tables.length;

                cols.push(
                    <div
                        key={page.id}
                        className={`${styles.pageCell} ${isActive ? styles.active : ''}`}
                        onClick={() => onPageSelect(page.id)}
                        title={`${page.name} (테이블 ${tableCount}개)`}
                    >
                        <div className={styles.pageName}>{page.name}</div>
                        <div className={styles.tableCount}>{tableCount}</div>
                    </div>
                );
            } else {
                cols.push(
                    <div
                        key={`empty-${r}-${c}`}
                        className={styles.emptyCell}
                    />
                );
            }
        }

        gridRows.push(
            <div key={`row-${r}`} className={styles.gridRow}>
                {cols}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>미니맵</span>
                <span className={styles.pageCount}>{pages.length}개 페이지</span>
            </div>
            <div className={styles.grid}>
                {gridRows}
            </div>
        </div>
    );
};

export default MiniMap;
