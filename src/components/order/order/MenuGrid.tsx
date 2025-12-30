'use client';

import React, { forwardRef, useMemo } from 'react';
import styles from '@/styles/components/order/order/MenuGrid.module.scss';
import { MenuItem } from '@/types';

interface MenuGridProps {
  items: MenuItem[];
  onMenuClick: (item: MenuItem) => void;
}

const MenuGrid = forwardRef<HTMLDivElement, MenuGridProps>(
  ({ items, onMenuClick }, ref) => {
    const groupedItems = useMemo(() => {
      const groups: Record<string, MenuItem[]> = {};
      items.forEach((item) => {
        const category = item.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(item);
      });
      return groups;
    }, [items]);

    return (
      <div className={styles.gridContainer} ref={ref}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className={styles.categorySection}>
            <div className={styles.categoryTitle}>{category}</div>
            <div className={styles.menuCards}>
              {categoryItems.map((item) => (
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
          </div>
        ))}
      </div>
    );
  }
);

MenuGrid.displayName = 'MenuGrid';

export default MenuGrid;
