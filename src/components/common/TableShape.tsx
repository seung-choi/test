'use client';

import React from 'react';
import styles from '@/styles/components/common/tableShape.module.scss';
import { TableType } from '@/types/order/tableSeat.type';

interface TableShapeProps {
    type: TableType;
    scale?: number;
    borderColor?: string;
    rotation?: number;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const baseDimensions: Record<TableType, { width: number; height: number }> = {
    '1x1': { width: 120, height: 120 },
    '1x2': { width: 120, height: 206 },
    '1x3': { width: 120, height: 292 },
    '1x4': { width: 120, height: 380 },
    '1x5': { width: 120, height: 475 },
    '2x1': { width: 206, height: 120 },
    '2x2': { width: 206, height: 206 },
    '3x1': { width: 292, height: 120 },
    '4x1': { width: 380, height: 120 },
    '5x1': { width: 475, height: 120 }
};

const TableShape: React.FC<TableShapeProps> = ({
    type,
    scale = 1,
    borderColor = '#959595',
    rotation = 0,
    children,
    className = '',
    style = {},
    onClick
}) => {
    const baseDim = baseDimensions[type];
    const width = baseDim.width * scale;
    const height = baseDim.height * scale;

    const renderBorders = () => {
        const borders = [];
        const s = scale;

        switch (type) {
            case '1x1':
                borders.push(
                    <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 23 * s, background: borderColor }} />,
                    <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98 * s, top: height, background: borderColor }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />
                );
                break;

            case '1x2':
                borders.push(
                    <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184 * s, background: borderColor }} />,
                    <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />,
                    <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108 * s, background: borderColor }} />
                );
                break;

            case '1x3':
                borders.push(
                    <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184 * s, background: borderColor }} />,
                    <div key="left3" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 270 * s, background: borderColor }} />,
                    <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />,
                    <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108 * s, background: borderColor }} />,
                    <div key="right3" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 194 * s, background: borderColor }} />
                );
                break;

            case '1x4':
                borders.push(
                    <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184 * s, background: borderColor }} />,
                    <div key="left3" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 269 * s, background: borderColor }} />,
                    <div key="left4" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 358 * s, background: borderColor }} />,
                    <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />,
                    <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108 * s, background: borderColor }} />,
                    <div key="right3" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 194 * s, background: borderColor }} />,
                    <div key="right4" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 283 * s, background: borderColor }} />
                );
                break;

            case '1x5':
                borders.push(
                    <div key="top" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="bottom" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184 * s, background: borderColor }} />,
                    <div key="left3" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 269 * s, background: borderColor }} />,
                    <div key="left4" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 358 * s, background: borderColor }} />,
                    <div key="left5" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 445 * s, background: borderColor }} />,
                    <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />,
                    <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108 * s, background: borderColor }} />,
                    <div key="right3" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 194 * s, background: borderColor }} />,
                    <div key="right4" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 283 * s, background: borderColor }} />,
                    <div key="right5" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 370 * s, background: borderColor }} />
                );
                break;

            case '2x1':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />
                );
                break;

            case '2x2':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor }} />,
                    <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184 * s, background: borderColor }} />,
                    <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />,
                    <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108 * s, background: borderColor }} />
                );
                break;

            case '3x1':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor }} />,
                    <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194 * s, background: borderColor }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor }} />,
                    <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269 * s, top: height, background: borderColor }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />
                );
                break;

            case '4x1':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor }} />,
                    <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194 * s, background: borderColor }} />,
                    <div key="top4" className={`${styles.border} ${styles.borderTop}`} style={{ left: 281 * s, background: borderColor }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98 * s, top: height, background: borderColor }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor }} />,
                    <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269 * s, top: height, background: borderColor }} />,
                    <div key="bottom4" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 357 * s, top: height, background: borderColor }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />
                );
                break;

            case '5x1':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor }} />,
                    <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194 * s, background: borderColor }} />,
                    <div key="top4" className={`${styles.border} ${styles.borderTop}`} style={{ left: 281 * s, background: borderColor }} />,
                    <div key="top5" className={`${styles.border} ${styles.borderTop}`} style={{ left: 367 * s, background: borderColor }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98 * s, top: height, background: borderColor }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor }} />,
                    <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269 * s, top: height, background: borderColor }} />,
                    <div key="bottom4" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 357 * s, top: height, background: borderColor }} />,
                    <div key="bottom5" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 443 * s, top: height, background: borderColor }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor }} />
                );
                break;
        }

        return borders;
    };

    const isVertical = rotation === 90 || rotation === 270;
    const displayWidth = isVertical ? height : width;
    const displayHeight = isVertical ? width : height;

    return (
        <div
            className={`${styles.tableShape} ${className}`}
            style={{
                width: displayWidth,
                height: displayHeight,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
                ...style
            }}
            onClick={onClick}
        >
            <div
                className={styles.innerContent}
                style={{
                    width: width - (24 * scale),
                    height: height - (24 * scale),
                    left: 12 * scale,
                    top: 12 * scale
                }}
            >
                {children}
            </div>
            {renderBorders()}
        </div>
    );
};

export default TableShape;
