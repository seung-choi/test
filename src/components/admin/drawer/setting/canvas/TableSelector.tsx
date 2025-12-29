'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableSelector.module.scss';
import { TableType, DragData } from '@/types/admin/layout.type';

const TableSelector: React.FC = () => {
    const handleDragStart = (e: React.DragEvent, type: TableType) => {
        const dragData: DragData = {
            type,
            isNew: true
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const baseDimensions = {
        '1x1': { width: 60, height: 60 },
        '1x2': { width: 60, height: 103 },
        '2x1': { width: 103, height: 60 },
        '2x2': { width: 103, height: 103 },
        '3x1': { width: 146, height: 60 },
        '4x1': { width: 190, height: 60 },
        '5x1': { width: 237, height: 60 }
    };

    const borderColor = '#7B7B7B';

    const render1x1 = () => {
        const { width, height } = baseDimensions['1x1'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table1x1}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '1x1')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>4인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 49, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
            </div>
        );
    };

    const render1x2 = () => {
        const { width, height } = baseDimensions['1x2'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table1x2}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '1x2')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>6인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 48, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 92, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 54, background: borderColor }} />
            </div>
        );
    };

    const render2x1 = () => {
        const { width, height } = baseDimensions['2x1'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table2x1}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '2x1')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>6인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 54, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 48, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 91, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
            </div>
        );
    };

    const render3x1 = () => {
        const { width, height } = baseDimensions['3x1'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table3x1}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '3x1')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>8인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 54, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 97, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 48, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 91, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 134, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
            </div>
        );
    };

    const render4x1 = () => {
        const { width, height } = baseDimensions['4x1'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table4x1}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '4x1')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>10인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 54, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 97, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 141, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 48, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 91, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 134, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 178, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
            </div>
        );
    };

    const render5x1 = () => {
        const { width, height } = baseDimensions['5x1'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table5x1}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '5x1')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>12인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 54, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 97, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 141, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 185, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 48, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 91, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 134, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 178, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 222, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
            </div>
        );
    };

    const render2x2 = () => {
        const { width, height } = baseDimensions['2x2'];
        return (
            <div
                className={`${styles.tableContainer} ${styles.table2x2}`}
                style={{ width, height }}
                draggable
                onDragStart={(e) => handleDragStart(e, '2x2')}
            >
                <div className={styles.innerContent}>
                    <div className={styles.capacity}>8인</div>
                </div>
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 54, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 48, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 91, top: height, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 49, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 92, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 11, background: borderColor }} />
                <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 54, background: borderColor }} />
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>테이블 선택</h2>
            <div className={styles.tableGrid}>
                <div className={styles.row}>
                    {render1x1()}
                    {render2x1()}
                </div>
                <div className={styles.row}>
                    {render2x2()}
                </div>
                <div className={styles.row}>
                    {render3x1()}
                </div>
                <div className={styles.row}>
                    {render4x1()}
                </div>
                <div className={styles.row}>
                    {render5x1()}
                </div>
            </div>
        </div>
    );
};

export default TableSelector;
