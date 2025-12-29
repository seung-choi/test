'use client';

import React, { useRef } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/layoutCanvas.module.scss';
import { PlacedTable, TableType, DragData } from '@/types/admin/layout.type';
import DraggableTableItem from './DraggableTableItem';

interface LayoutCanvasProps {
    placedTables: PlacedTable[];
    onAddTable: (type: TableType, position: { x: number; y: number }) => void;
    onMoveTable: (tableId: string, position: { x: number; y: number }) => void;
    onRemoveTable: (tableId: string) => void;
    onSetTableNumber: (tableId: string, tableNumber: string) => void;
    onRotateTable: (tableId: string) => void;
}

const LayoutCanvas: React.FC<LayoutCanvasProps> = ({
    placedTables,
    onAddTable,
    onMoveTable,
    onRemoveTable,
    onSetTableNumber,
    onRotateTable
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const dragOverTableId = useRef<string | null>(null);

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
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (dragData.isNew) {
            onAddTable(dragData.type, { x, y });
        } else if (dragData.tableId) {
            onMoveTable(dragData.tableId, { x, y });
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
                <img src="/assets/image/admin/canvas.png" alt="canvas" />

                {placedTables.map((table) => (
                    <DraggableTableItem
                        key={table.id}
                        table={table}
                        onMove={onMoveTable}
                        onRemove={onRemoveTable}
                        onSetTableNumber={onSetTableNumber}
                        onRotate={onRotateTable}
                        placedTables={placedTables}
                    />
                ))}
            </div>
        </div>
    );
};

export default LayoutCanvas;
