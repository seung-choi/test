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
    T4S: { width: 120, height: 120 },
    T6R: { width: 206, height: 120 },
    T8S: { width: 206, height: 206 },
    T8R: { width: 292, height: 120 },
    T10R: { width: 380, height: 120 },
    T12R: { width: 475, height: 120 }
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
    const sizeScale = 0.8;
    const scaledFactor = scale * sizeScale;
    const width = baseDim.width * scaledFactor;
    const height = baseDim.height * scaledFactor;

    const isOccupied = status === 'occupied';
    const borderColor = variant === 'order'
        ? (isOccupied ? '#9081D8' : '#959595')
        : (customBorderColor || '#959595');
    const footerColor = variant === 'order'
        ? (isOccupied ? '#6600FF' : '#D9D9D9')
        : undefined;

    const renderBorders = () => {
        const borders = [];
        const s = scaledFactor;
        const borderWidth = 76 * s;
        const borderHeight = (variant === 'order' ? 9 : 11) * s;
        const borderRadius = (variant === 'order' ? 5 : 10) * s;

        switch (type) {
            case 'T4S':
                borders.push(
                    <div
                        key="top"
                        className={`${styles.border} ${styles.borderTop}`}
                        style={{ left: 23 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
                    />,
                    <div
                        key="bottom"
                        className={`${styles.border} ${styles.borderBottom}`}
                        style={{ left: 98 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
                    />,
                    <div
                        key="left"
                        className={`${styles.border} ${styles.borderLeft}`}
                        style={{ left: 0, top: 98 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
                    />,
                    <div
                        key="right"
                        className={`${styles.border} ${styles.borderRight}`}
                        style={{ left: width, top: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
                    />
                );
                break;
            case 'T6R':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                );
                break;

            case 'T8S':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="left1" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="left2" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="right1" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="right2" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                );
                break;

            case 'T8R':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                );
                break;

            case 'T10R':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top4" className={`${styles.border} ${styles.borderTop}`} style={{ left: 281 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom4" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 357 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                );
                break;

            case 'T12R':
                borders.push(
                    <div key="top1" className={`${styles.border} ${styles.borderTop}`} style={{ left: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top2" className={`${styles.border} ${styles.borderTop}`} style={{ left: 108 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top3" className={`${styles.border} ${styles.borderTop}`} style={{ left: 194 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top4" className={`${styles.border} ${styles.borderTop}`} style={{ left: 281 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="top5" className={`${styles.border} ${styles.borderTop}`} style={{ left: 367 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom1" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom2" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom3" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom4" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 357 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="bottom5" className={`${styles.border} ${styles.borderBottom}`} style={{ left: 443 * s, top: height, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="left" className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />,
                    <div key="right" className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22 * s, background: borderColor, width: borderWidth, height: borderHeight, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                );
                break;
        }

        return borders;
    };

    const isVertical = rotation === 90 || rotation === 270;
    const displayWidth = isVertical ? height : width;
    const displayHeight = isVertical ? width : height;
    const borderLayerLeft = (displayWidth - width) / 2;
    const borderLayerTop = (displayHeight - height) / 2;

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

    const contentWidthBase = width - (24 * scaledFactor);
    const contentHeightBase = height - (24 * scaledFactor);
    const contentWidth = isVertical ? contentHeightBase : contentWidthBase;
    const contentHeight = isVertical ? contentWidthBase : contentHeightBase;
    const contentLeft = (displayWidth - contentWidth) / 2;
    const contentTop = (displayHeight - contentHeight) / 2;

    return (
        <div
            className={`${styles.tableShape} ${variant === 'order' ? styles.orderVariant : ''} ${className}`}
            style={{
                width: displayWidth,
                height: displayHeight,
                transform: 'rotate(0deg)',
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
                    width: contentWidth,
                    height: contentHeight,
                    left: contentLeft,
                    top: contentTop,
                    transformOrigin: 'center'
                }}
            >
                {variant === 'order' ? renderOrderContent() : children}
            </div>
            <div
                style={{
                    position: 'absolute',
                    width,
                    height,
                    left: borderLayerLeft,
                    top: borderLayerTop,
                    transform: isVertical ? `rotate(${rotation}deg)` : undefined,
                    transformOrigin: 'center'
                }}
            >
                {renderBorders()}
            </div>
        </div>
    );
};

export default TableShape;
