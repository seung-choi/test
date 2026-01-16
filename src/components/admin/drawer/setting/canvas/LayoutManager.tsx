'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import TableSelector from './TableSelector';
import LayoutCanvas from './LayoutCanvas';
import TableNumberList from './TableNumberList';
import LayoutTabs from './LayoutTabs';
import TableListView from './TableListView';
import ControlPanel from './ControlPanel';
import styles from '@/styles/components/admin/drawer/canvas/layoutManager.module.scss';
import { usePanZoom } from '@/hooks/tableCanvas/usePanZoom';
import { usePageManagement } from '@/hooks/tableCanvas/usePageManagement';
import { useTableManagement } from '@/hooks/tableCanvas/useTableManagement';
import { usePatchTableOrder, usePutTableList, useTableList } from '@/hooks/api';
import { useToast } from '@/hooks/common/useToast';
import type { GetTableResponse, PlacedTable, TableType } from '@/types';

const LayoutManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');
    const [deletedTableIds, setDeletedTableIds] = useState<Set<number>>(new Set());

    const {
        zoom,
        pan,
        isPanning,
        containerRef,
        handleZoomIn,
        handleZoomOut,
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
        handleRotateTable,
        handleReorderTables
    } = useTableManagement({ pages, setPages, currentPageId });

    const { data: tableList = [] } = useTableList();
    const { mutateAsync: putTableList } = usePutTableList();
    const { mutateAsync: patchTableOrder } = usePatchTableOrder();
    const { showToast } = useToast();
    const [tableListOrder, setTableListOrder] = useState<GetTableResponse[]>([]);

    const normalizeNumber = (value: string) => value.trim().replace(/번$/, '');

    const parseXyr = (value: string) => {
        const [x, y, r] = value.split(',').map((item) => Number(item));
        return {
            x: Number.isFinite(x) ? x : 0,
            y: Number.isFinite(y) ? y : 0,
            r: Number.isFinite(r) ? r : 0
        };
    };

    const parseWhp = (value: string) => {
        const [w, h, p] = value.split(',').map((item) => Number(item));
        return {
            w: Number.isFinite(w) ? w : 0,
            h: Number.isFinite(h) ? h : 0,
            p: Number.isFinite(p) ? p : 1
        };
    };

    const isTableType = (value: string | null): value is TableType => {
        return value === 'T4S' || value === 'T6R' || value === 'T8S' || value === 'T8R' || value === 'T10R' || value === 'T12R';
    };

    const mappedTables = useMemo(() => {
        return tableList
            .filter((table) => isTableType(table.tableCd))
            .map((table: GetTableResponse) => {
            const { x, y, r } = parseXyr(table.tableXyr || '0,0,0');
            const { p } = parseWhp(table.tableWhp || '0,0,1');
            const pageIndex = Number.isFinite(p) && p > 0 ? Math.floor(p) - 1 : 0;

            return {
                pageIndex,
                table: {
                    id: `table-${table.tableId}`,
                    tableId: table.tableId,
                    type: table.tableCd as TableType,
                    position: { x, y },
                    rotation: r,
                    scale: 1,
                    tableNumber: table.tableNo
                } as PlacedTable
            };
        });
    }, [tableList]);

    const availableTableNumbers = useMemo(
        () => tableList.map((table) => table.tableNo),
        [tableList]
    );

    const pagesFromApi = useMemo(() => {
        if (mappedTables.length === 0) {
            return [{ id: 'page-0-0', name: 'Page 1', tables: [], gridPosition: { row: 0, col: 0 } }];
        }

        const maxPageIndex = Math.max(...mappedTables.map(({ pageIndex }) => pageIndex));
        const pages = Array.from({ length: maxPageIndex + 1 }, (_, index) => ({
            id: `page-0-${index}`,
            name: `Page ${index + 1}`,
            tables: [] as PlacedTable[],
            gridPosition: { row: 0, col: index }
        }));

        mappedTables.forEach(({ pageIndex, table }) => {
            pages[pageIndex]?.tables.push(table);
        });

        return pages;
    }, [mappedTables]);

    useEffect(() => {
        setPages(pagesFromApi);
    }, [pagesFromApi, setPages]);

    useEffect(() => {
        setTableListOrder(tableList);
    }, [tableList]);

    const getPlacedTablesByPageId = useCallback(
        (pageId?: string) => pages.find((page) => page.id === pageId)?.tables ?? [],
        [pages]
    );

    const allTablesWithPage = pages.flatMap(page =>
        page.tables.map(table => ({
            ...table,
            pageName: page.name
        }))
    );

    const linkedNumbers = useMemo(() => {
        return pages
            .flatMap(page => page.tables)
            .map(table => table.tableNumber)
            .filter((value): value is string => Boolean(value));
    }, [pages]);

    const handleSave = useCallback(async () => {
        const placementMap = new Map<number, { table: PlacedTable; pageIndex: number }>();

        pages.forEach((page, pageIndex) => {
            page.tables.forEach((table) => {
                if (table.tableId) {
                    placementMap.set(table.tableId, { table, pageIndex });
                }
            });
        });

        const payload = tableList.map((tableInfo) => {
            if (deletedTableIds.has(tableInfo.tableId)) {
                return {
                    tableId: tableInfo.tableId,
                    tableCd: null,
                    tableXyr: null,
                    tableWhp: null
                };
            }

            const placement = placementMap.get(tableInfo.tableId);
            if (!placement) {
                return {
                    tableId: tableInfo.tableId,
                    tableCd: null,
                    tableXyr: null,
                    tableWhp: null
                };
            }

            const { table, pageIndex } = placement;
            const x = Math.round(table.position.x);
            const y = Math.round(table.position.y);
            const r = table.rotation ?? 0;
            const tableXyr = `${x},${y},${r}`;
            const tableWhp = `1920,1080,${pageIndex + 1}`;

            return {
                tableId: tableInfo.tableId,
                tableCd: table.type,
                tableXyr,
                tableWhp
            };
        });

        await putTableList(payload);
        setDeletedTableIds(new Set());
        showToast('테이블 배치가 저장되었습니다.', 'success');
    }, [pages, putTableList, tableList, deletedTableIds]);

    const handleTableOrderChange = useCallback(async (reorderedTables: GetTableResponse[]) => {
        const updatedTables = reorderedTables.map((table, index) => ({
            ...table,
            tableOrd: index + 1
        }));
        setTableListOrder(updatedTables);
        const payload = updatedTables.map((table) => ({
            tableId: table.tableId,
            tableOrd: table.tableOrd
        }));
        await patchTableOrder(payload);
    }, [patchTableOrder]);

    const handleAssignTableNumber = useCallback((tableId: string, tableNumber: string, targetPageId?: string) => {
        const pageId = targetPageId || currentPageId;
        const normalized = normalizeNumber(tableNumber);
        const matched = tableList.find((item) => normalizeNumber(item.tableNo) === normalized);
        const resolvedId = matched?.tableId;

        if (resolvedId) {
            setDeletedTableIds((prev) => {
                const next = new Set(prev);
                next.delete(resolvedId);
                return next;
            });
        }

        setPages(prev =>
            prev.map(page =>
                page.id === pageId
                    ? {
                        ...page,
                        tables: page.tables.map(table =>
                            table.id === tableId
                                ? { ...table, tableNumber: normalized, tableId: resolvedId ?? table.tableId }
                                : table
                        )
                    }
                    : page
            )
        );
    }, [currentPageId, setPages, tableList]);

    const handleRemoveTableForSave = useCallback((tableId: string, targetPageId?: string) => {
        const pageId = targetPageId || currentPageId;
        const targetTable = pages
            .find(page => page.id === pageId)
            ?.tables.find(table => table.id === tableId);

        handleRemoveTable(tableId, pageId);

        if (!targetTable?.tableId) return;

        setDeletedTableIds((prev) => {
            const next = new Set(prev);
            next.add(targetTable.tableId!);
            return next;
        });
    }, [currentPageId, handleRemoveTable, pages]);

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
                            onRemoveTable={handleRemoveTableForSave}
                            onSetTableNumber={handleAssignTableNumber}
                            onRotateTable={handleRotateTable}
                            availableTableNumbers={availableTableNumbers}
                            onSelect={handlePageSelect}
                            getPlacedTablesByPageId={getPlacedTablesByPageId}
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
                <LayoutTabs activeTab={activeTab} onTabChange={setActiveTab} onSave={handleSave} />
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
                            onPageDelete={() => handlePageDelete(currentPageId)}
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
                        </div>
                    </div>
                ) : (
                    <TableListView
                        placedTables={allTablesWithPage}
                        tableList={tableListOrder}
                        onReorderPlacedTables={handleReorderTables}
                        onReorderTableList={handleTableOrderChange}
                    />
                )}
            </div>
            <TableNumberList linkedNumbers={linkedNumbers} />
        </div>
    );
};

export default LayoutManager;
