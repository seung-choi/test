'use client';

import React, { useState, useCallback } from 'react';
import TableSelector from './TableSelector';
import LayoutCanvas from './LayoutCanvas';
import TableNumberList from './TableNumberList';
import LayoutTabs from './LayoutTabs';
import TableListView from './TableListView';
import ControlPanel from './ControlPanel';
import SaveButtons from './SaveButtons';
import styles from '@/styles/components/admin/drawer/canvas/layoutManager.module.scss';
import { usePanZoom } from '@/hooks/usePanZoom';
import { usePageManagement } from '@/hooks/usePageManagement';
import { useTableManagement } from '@/hooks/useTableManagement';

const LayoutManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');

    // 커스텀 훅들 사용
    const {
        zoom,
        pan,
        isPanning,
        containerRef,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleMouseDown
    } = usePanZoom();

    const {
        pages,
        setPages,
        currentPageId,
        getGridBounds,
        getPageAt,
        handlePageAdd,
        handlePageDelete,
        handlePageSelect
    } = usePageManagement();

    const {
        handleAddTable,
        handleMoveTable,
        handleRemoveTable,
        handleSetTableNumber,
        handleRotateTable,
        handleReorderTables
    } = useTableManagement({ pages, setPages, currentPageId });

    const allTablesWithPage = pages.flatMap(page =>
        page.tables.map(table => ({
            ...table,
            pageName: page.name
        }))
    );

    const handleEdit = useCallback(() => {}, []);

    const handleSave = useCallback(() => {
        alert('테이블 배치가 저장되었습니다.');
    }, [pages]);

    const renderPageGrid = (): JSX.Element => {
        const bounds = getGridBounds();
        const rows: JSX.Element[] = [];

        for (let r = bounds.minRow; r <= bounds.maxRow; r++) {
            const cols: JSX.Element[] = [];

            for (let c = bounds.minCol; c <= bounds.maxCol; c++) {
                const page = getPageAt(r, c);

                if (page) {
                    cols.push(
                        <LayoutCanvas
                            key={page.id}
                            pageId={page.id}
                            placedTables={page.tables}
                            onAddTable={handleAddTable}
                            onMoveTable={handleMoveTable}
                            onRemoveTable={handleRemoveTable}
                            onSetTableNumber={handleSetTableNumber}
                            onRotateTable={handleRotateTable}
                            gridPosition={page.gridPosition}
                        />
                    );
                }
            }

            if (cols.length > 0) {
                rows.push(
                    <div key={`row-${r}`} className={styles.gridRow}>
                        {cols}
                    </div>
                );
            }
        }

        return <div className={styles.gridContainer}>{rows}</div>;
    };

    return (
        <div className={styles.container}>
            <TableSelector />
            <div className={styles.canvasWrapper}>
                <LayoutTabs activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === 'table' ? (
                    <div
                        ref={containerRef}
                        className={styles.pagesContainer}
                        onMouseDown={handleMouseDown}
                        style={{
                            cursor: isPanning ? 'grabbing' : 'default',
                            userSelect: isPanning ? 'none' : 'auto'
                        }}
                    >
                        <ControlPanel
                            pages={pages}
                            onPageAdd={handlePageAdd}
                            onPageDelete={handlePageDelete}
                        />

                        <div
                            className={styles.zoomContainer}
                            style={{
                                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                transformOrigin: '0 0'
                            }}
                        >
                            {renderPageGrid()}
                        </div>

                        <div className={styles.zoomControls}>
                            <button onClick={handleZoomIn} className={styles.zoomButton}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                            <div className={styles.zoomLevel}>{Math.round(zoom * 100)}%</div>
                            <button onClick={handleZoomOut} className={styles.zoomButton}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                            <button onClick={handleZoomReset} className={styles.zoomResetButton} title="Reset Zoom (100%)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C9.68852 20 7.61295 18.978 6.19299 17.366" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M3 17L6.5 17.5L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <text x="12" y="14" fontSize="8" fill="currentColor" textAnchor="middle" fontWeight="600">1:1</text>
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <TableListView
                        placedTables={allTablesWithPage}
                        onReorder={handleReorderTables}
                    />
                )}
            </div>
            <TableNumberList />
            <div className={styles.saveButtonsWrapper}>
                <SaveButtons onEdit={handleEdit} onSave={handleSave} />
            </div>
        </div>
    );
};

export default LayoutManager;
