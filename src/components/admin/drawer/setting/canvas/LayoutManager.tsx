'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import TableSelector from './TableSelector';
import LayoutCanvas from './LayoutCanvas';
import TableNumberList from './TableNumberList';
import LayoutTabs from './LayoutTabs';
import TableListView from './TableListView';
import ControlPanel from './ControlPanel';
import SaveButtons from './SaveButtons';
import styles from '@/styles/components/admin/drawer/canvas/layoutManager.module.scss';
import { PlacedTable, TableType, LayoutPage } from '@/types';

const LayoutManager: React.FC = () => {
    const [pages, setPages] = useState<LayoutPage[]>([
        { id: 'page-0-0', name: 'Page 1', tables: [], gridPosition: { row: 0, col: 0 } }
    ]);
    const [currentPageId, setCurrentPageId] = useState('page-0-0');
    const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    const currentPage = pages.find(p => p.id === currentPageId);
    const placedTables = currentPage?.tables || [];

    // 목록 모드용: 모든 페이지의 테이블 합치기 (페이지 정보 포함)
    const allTablesWithPage = pages.flatMap(page =>
        page.tables.map(table => ({
            ...table,
            pageName: page.name
        }))
    );

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

    const updatePageTables = useCallback((pageId: string, updater: (tables: PlacedTable[]) => PlacedTable[]) => {
        setPages(prev =>
            prev.map(page =>
                page.id === pageId
                    ? { ...page, tables: updater(page.tables) }
                    : page
            )
        );
    }, []);

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

        // 같은 페이지 내 이동
        if (source === target) {
            updatePageTables(target, tables =>
                tables.map(table =>
                    table.id === tableId ? { ...table, position } : table
                )
            );
        } else {
            // 페이지 간 이동
            setPages(prev => {
                const sourcePage = prev.find(p => p.id === source);
                const tableToMove = sourcePage?.tables.find(t => t.id === tableId);

                if (!tableToMove) return prev;

                return prev.map(page => {
                    if (page.id === source) {
                        // 원본 페이지에서 제거
                        return { ...page, tables: page.tables.filter(t => t.id !== tableId) };
                    } else if (page.id === target) {
                        // 대상 페이지에 추가
                        return { ...page, tables: [...page.tables, { ...tableToMove, position }] };
                    }
                    return page;
                });
            });
        }
    }, [currentPageId, updatePageTables]);

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

    const handlePageAdd = useCallback((direction: 'horizontal' | 'vertical') => {
        const sourcePage = pages.find(p => p.id === currentPageId);
        if (!sourcePage) return;

        const { row, col } = sourcePage.gridPosition;
        const newRow = direction === 'vertical' ? row + 1 : row;
        const newCol = direction === 'horizontal' ? col + 1 : col;

        const existingPage = getPageAt(newRow, newCol);
        if (existingPage) {
            setCurrentPageId(existingPage.id);
            return;
        }

        setPages(prev => {
            const newPages = [...prev];
            const bounds = {
                minRow: Math.min(...newPages.map(p => p.gridPosition.row)),
                maxRow: Math.max(...newPages.map(p => p.gridPosition.row)),
                minCol: Math.min(...newPages.map(p => p.gridPosition.col)),
                maxCol: Math.max(...newPages.map(p => p.gridPosition.col))
            };

            const expandedMinRow = Math.min(bounds.minRow, newRow);
            const expandedMaxRow = Math.max(bounds.maxRow, newRow);
            const expandedMinCol = Math.min(bounds.minCol, newCol);
            const expandedMaxCol = Math.max(bounds.maxCol, newCol);

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

        setCurrentPageId(`page-${newRow}-${newCol}`);
    }, [pages, currentPageId, getPageAt]);

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

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.1, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.1, 0.3));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleEdit = useCallback(() => {
        // TODO: 수정 모드 활성화 로직
        console.log('수정 모드 활성화');
    }, []);

    const handleSave = useCallback(() => {
        // TODO: 테이블 배치 저장 로직
        console.log('저장:', pages);
        alert('테이블 배치가 저장되었습니다.');
    }, [pages]);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
        }
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        const isInteractiveElement = target.closest('button') ||
                                     target.closest('[draggable]') ||
                                     target.closest('input') ||
                                     target.closest('select') ||
                                     target.hasAttribute('data-table-item');

        if (!isInteractiveElement && e.button === 0) {
            e.preventDefault();
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        } else if (e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isPanning) {
            setPan({
                x: e.clientX - startPan.x,
                y: e.clientY - startPan.y
            });
        }
    }, [isPanning, startPan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleWheel, handleMouseMove, handleMouseUp]);

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
