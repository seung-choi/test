'use client';

import React, { useMemo } from 'react';
import styles from '@/styles/components/common/tableShape.module.scss';
import { BASE_DIMENSIONS, SIZE_SCALE, CONTENT_PADDING } from '@/utils/tableShape/types';
import { calculateBorderPositions } from '@/utils/tableShape/borderCalculator';
import type { TableShapeProps } from '@/types';

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
  tableId
}) => {
  const baseDim = BASE_DIMENSIONS[type];
  const scaledFactor = scale * SIZE_SCALE;
  const width = baseDim.width * scaledFactor;
  const height = baseDim.height * scaledFactor;

  const isOccupied = status === 'occupied';
  const borderColor = variant === 'order'
    ? (isOccupied ? '#9081D8' : '#959595')
    : (customBorderColor || '#959595');
  const footerColor = variant === 'order'
    ? (isOccupied ? '#6600FF' : '#D9D9D9')
    : undefined;

  const isVertical = rotation === 90 || rotation === 270;
  const displayWidth = isVertical ? height : width;
  const displayHeight = isVertical ? width : height;

  const contentBaseWidth = baseDim.width - CONTENT_PADDING;
  const contentBaseHeight = baseDim.height - CONTENT_PADDING;
  const baseContentWidth = contentBaseWidth * scaledFactor;
  const baseContentHeight = contentBaseHeight * scaledFactor;

  const contentWidth = isVertical ? baseContentHeight : baseContentWidth;
  const contentHeight = isVertical ? baseContentWidth : baseContentHeight;
  const contentLeft = (displayWidth - contentWidth) / 2;
  const contentTop = (displayHeight - contentHeight) / 2;

  const borderPositions = useMemo(
    () => calculateBorderPositions(type, scaledFactor),
    [type, scaledFactor]
  );

  const borderConfig = useMemo(() => {
    const borderWidth = 76 * scaledFactor;
    const borderHeight = (variant === 'order' ? 9 : 11) * scaledFactor;
    const borderRadius = (variant === 'order' ? 5 : 10) * scaledFactor;
    return { borderWidth, borderHeight, borderRadius };
  }, [scaledFactor, variant]);

  const renderBorders = () => {
    return borderPositions.map((pos) => (
      <div
        key={pos.key}
        className={`${styles.border} ${styles[`border${pos.className.charAt(0).toUpperCase()}${pos.className.slice(1)}`]}`}
        style={{
          left: pos.className === 'left'
            ? 0
            : pos.className === 'right'
              ? width
              : pos.left,
          top: pos.top ?? (pos.className === 'bottom' ? height : undefined),
          background: borderColor,
          width: borderConfig.borderWidth,
          height: borderConfig.borderHeight,
          borderTopLeftRadius: borderConfig.borderRadius,
          borderTopRightRadius: borderConfig.borderRadius
        }}
      />
    ));
  };

  const renderOrderContent = () => {
    if (variant !== 'order') return null;

    return (
      <>
        <div
          className={`${styles.time} ${styles[`time${type}`]} ${reservation ? styles.timeWithReservation : styles.timeWithoutReservation}`}
        >
          {reservation?.time || '00:00'}
        </div>
        {reservation?.name && (
          <div
            className={`${styles.name} ${styles[`name${type}`]}`}
          >
            {reservation.name}
          </div>
        )}
        {reservation?.group && (
          <div
            className={`${styles.group} ${styles[`group${type}`]}`}
          >
            {reservation.group}
          </div>
        )}
        <div
          className={`${styles.footer} ${styles[`footer${type}`]}`}
          style={{
            background: footerColor,
          }}
        >
          <div className={`${styles.tableNumber} ${tableId && tableId.length > 2 ? styles.tableNumberLong : styles.tableNumberShort}`}>
            {tableId}
          </div>
        </div>
      </>
    );
  };

  const borderLayerLeft = (displayWidth - width) / 2;
  const borderLayerTop = (displayHeight - height) / 2;

  return (
    <div
      className={`${styles.tableShape} ${variant === 'order' ? styles.orderVariant : ''} ${className}`}
      data-no-pan="true"
      style={{
        width: displayWidth,
        height: displayHeight,
        cursor: variant === 'order' && status === 'empty' ? 'default' : (onClick ? 'pointer' : 'default'),
        ...style
      }}
      onClick={onClick}
    >
      <div
        className={styles.innerContent}
        style={{
          width: contentWidth,
          height: contentHeight,
          left: contentLeft,
          top: contentTop
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
