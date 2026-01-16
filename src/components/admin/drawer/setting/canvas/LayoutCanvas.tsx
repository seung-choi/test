'use client';

import React, { useRef } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/layoutCanvas.module.scss';
import { PlacedTable, TableType, DragData } from '@/types';
import DraggableTableItem from './DraggableTableItem';
import type { LayoutCanvasProps } from '@/types';

const LayoutCanvas: React.FC<LayoutCanvasProps> = ({
    pageId,
    placedTables,
    onAddTable,
    onMoveTable,
    onRemoveTable,
    onSetTableNumber,
    onRotateTable,
    availableTableNumbers,
    onSelect,
    getPlacedTablesByPageId
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
        <div
            className={styles.container}
            onClick={() => onSelect?.(pageId)}
            data-page-canvas="true"
            data-page-id={pageId}
        >
            <div
                ref={canvasRef}
                className={styles.canvas}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-page-canvas-inner="true"
            >
                <img className={styles.canvasImage} src="/assets/image/admin/canvas.png" alt="canvas" />

                {placedTables.map((table) => (
                    <DraggableTableItem
                        key={table.id}
                        table={table}
                        onMove={(tableId, position, targetPageId) => onMoveTable(tableId, position, pageId, targetPageId)}
                        onRemove={(tableId) => onRemoveTable(tableId, pageId)}
                        onSetTableNumber={(tableId, tableNumber) => onSetTableNumber(tableId, tableNumber, pageId)}
                        onRotate={(tableId) => onRotateTable(tableId, pageId)}
                        placedTables={placedTables}
                        pageId={pageId}
                        getPlacedTablesByPageId={getPlacedTablesByPageId}
                        availableTableNumbers={availableTableNumbers}
                    />
                ))}
            </div>

        </div>
    );
};

export default LayoutCanvas;
