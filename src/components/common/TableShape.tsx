'use client';

import React from 'react';
import styles from '@/styles/components/common/tableShape.module.scss';
import { TableType } from '@/types';

interface Reservation {
    time: string;
    name?: string;
    group?: string;
}

interface TableShapeProps {
    type: TableType;
    scale?: number;
    borderColor?: string;
    rotation?: number;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    variant?: 'order' | 'admin';
    reservation?: Reservation;
    status?: 'empty' | 'occupied';
    tableNumber?: string;
    tableId?: string;
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
    borderColor: customBorderColor,
    rotation = 0,
    children,
    className = '',
    style = {},
    onClick,
    variant = 'admin',
    reservation,
    status = 'empty',
    tableNumber,
    tableId
}) => {
    const baseDim = baseDimensions[type];
    const width = baseDim.width * scale;
    const height = baseDim.height * scale;

    // order variant에서는 status에 따라 색상 변경
    const isOccupied = status === 'occupied';
    const borderColor = variant === 'order'
        ? (isOccupied ? '#9081D8' : '#959595')
        : (customBorderColor || '#959595');
    const footerColor = variant === 'order'
        ? (isOccupied ? '#6600FF' : '#D9D9D9')
        : undefined;

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

    const renderOrderContent = () => {
        if (variant !== 'order') return null;

        return (
            <>
                <div className={`${styles.time} ${styles[`time${type}`]} ${reservation ? styles.timeWithReservation : styles.timeWithoutReservation}`}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={`${styles.name} ${styles[`name${type}`]}`}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={`${styles.group} ${styles[`group${type}`]}`}>
                        {reservation.group}
                    </div>
                )}
                <div className={`${styles.footer} ${styles[`footer${type}`]}`} style={{ background: footerColor }}>
                    <div className={`${styles.tableNumber} ${tableId && tableId.length > 2 ? styles.tableNumberLong : styles.tableNumberShort}`}>
                        {tableId}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div
            className={`${styles.tableShape} ${variant === 'order' ? styles.orderVariant : ''} ${className}`}
            style={{
                width: displayWidth,
                height: displayHeight,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
                cursor: variant === 'order' && status === 'empty' ? 'default' : (onClick ? 'pointer' : 'default'),
                transition: variant === 'order' ? 'transform 0.2s ease' : undefined,
                ...style
            }}
            onClick={onClick}
            data-테이블={variant === 'order' ? type : undefined}
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
                {variant === 'order' ? renderOrderContent() : children}
            </div>
            {renderBorders()}
        </div>
    );
};

export default TableShape;
