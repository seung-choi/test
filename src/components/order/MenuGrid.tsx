'use client';

import React, { forwardRef } from 'react';
import styles from '@/styles/components/order/order/MenuGrid.module.scss';
import { MenuItem } from '@/types/order/order.type';

interface MenuGridProps {
  items: MenuItem[];
  onMenuClick: (item: MenuItem) => void;
}

const MenuGrid = forwardRef<HTMLDivElement, MenuGridProps>(
  ({ items, onMenuClick }, ref) => {
    return (
      <div className={styles.gridContainer} ref={ref}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.menuCard}
          onClick={() => onMenuClick(item)}
        >
          <div className={styles.imageWrapper}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className={styles.menuImage}
              onError={(e) => {
                e.currentTarget.src = '/assets/image/order/fallback.svg';
              }}
            />
            <div className={styles.gradientOverlay} />
          </div>
          <div className={styles.menuInfo}>
            <div className={styles.menuName}>{item.name}</div>
            <div className={styles.menuPrice}>
              ₩{item.price.toLocaleString('ko-KR')}
            </div>
          </div>
        </div>
      ))}
      </div>
    );
  }
);

MenuGrid.displayName = 'MenuGrid';

export default MenuGrid;
