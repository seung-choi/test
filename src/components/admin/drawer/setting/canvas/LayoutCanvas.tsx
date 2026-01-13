'use client';

import React, { useRef } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/layoutCanvas.module.scss';
import { PlacedTable, TableType, DragData } from '@/types';
import DraggableTableItem from './DraggableTableItem';
import { isPositionValid } from '@/utils/tableCollision';

interface LayoutCanvasProps {
    pageId?: string;
    placedTables: PlacedTable[];
    onAddTable: (type: TableType, position: { x: number; y: number }, pageId?: string) => void;
    onMoveTable: (tableId: string, position: { x: number; y: number }, sourcePageId?: string, targetPageId?: string) => void;
    onRemoveTable: (tableId: string, pageId?: string) => void;
    onSetTableNumber: (tableId: string, tableNumber: string, pageId?: string) => void;
    onRotateTable: (tableId: string, pageId?: string) => void;
    onPageAdd?: (direction: 'right' | 'bottom' | 'left' | 'top') => void;
    onPageDelete?: (pageId: string) => void;
    gridPosition?: { row: number; col: number };
    availableTableNumbers: string[];
}

const LayoutCanvas: React.FC<LayoutCanvasProps> = ({
    pageId,
    placedTables,
    onAddTable,
    onMoveTable,
    onRemoveTable,
    onSetTableNumber,
    onRotateTable,
    onPageAdd,
    onPageDelete,
    availableTableNumbers
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if (!canvasRef.current) return;

        const data = e.dataTransfer.getData('application/json');
        if (!data) return;

        const dragData: DragData = JSON.parse(data);

        if (dragData.isNew) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            onAddTable(dragData.type, { x, y }, pageId);
        }
    };

    return (
        <div className={styles.container}>
            <div
                ref={canvasRef}
                className={styles.canvas}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <img className={styles.canvasImage} src="/assets/image/admin/canvas.png" alt="canvas" />

                {placedTables.map((table) => (
                    <DraggableTableItem
                        key={table.id}
                        table={table}
                        onMove={(tableId, position) => onMoveTable(tableId, position, pageId, pageId)}
                        onRemove={(tableId) => onRemoveTable(tableId, pageId)}
                        onSetTableNumber={(tableId, tableNumber) => onSetTableNumber(tableId, tableNumber, pageId)}
                        onRotate={(tableId) => onRotateTable(tableId, pageId)}
                        placedTables={placedTables}
                        pageId={pageId}
                        availableTableNumbers={availableTableNumbers}
                    />
                ))}
            </div>

            {onPageAdd && (
                <>
                    <button
                        className={styles.pageAddButtonRight}
                        onClick={() => onPageAdd('right')}
                        title="우측에 페이지 추가"
                    >
                        <img src="/assets/image/admin/setting/page_add.svg" alt="add page right" />
                    </button>
                    <button
                        className={styles.pageAddButtonBottom}
                        onClick={() => onPageAdd('bottom')}
                        title="하단에 페이지 추가"
                    >
                        <img src="/assets/image/admin/setting/page_add.svg" alt="add page bottom" />
                    </button>
                    <button
                        className={styles.pageAddButtonLeft}
                        onClick={() => onPageAdd('left')}
                        title="좌측에 페이지 추가"
                    >
                        <img src="/assets/image/admin/setting/page_add.svg" alt="add page left" />
                    </button>
                    <button
                        className={styles.pageAddButtonTop}
                        onClick={() => onPageAdd('top')}
                        title="상단에 페이지 추가"
                    >
                        <img src="/assets/image/admin/setting/page_add.svg" alt="add page top" />
                    </button>
                </>
            )}

            {onPageDelete && (
                <button
                    className={styles.pageDeleteButton}
                    onClick={() => pageId && onPageDelete(pageId)}
                    title="현재 페이지 삭제"
                >
                    <img src="/assets/image/admin/setting/page_delete.svg" alt="delete page" />
                </button>
            )}
        </div>
    );
};

export default LayoutCanvas;
