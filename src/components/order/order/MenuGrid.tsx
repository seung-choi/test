'use client';

import React, { forwardRef, useMemo } from 'react';
import styles from '@/styles/components/order/order/MenuGrid.module.scss';
import { MenuItem } from '@/types';

interface MenuGridProps {
  items: MenuItem[];
  categories: string[];
  onMenuClick: (item: MenuItem) => void;
}

const MenuGrid = forwardRef<HTMLDivElement, MenuGridProps>(
  ({ items, categories, onMenuClick }, ref) => {
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
    const displayCategories = useMemo(
      () => categories.filter((category) => category !== '전체메뉴'),
      [categories]
    );

    return (
      <div className={styles.gridContainer} ref={ref}>
        {displayCategories.map((category) => {
          const categoryItems = groupedItems[category] || [];
          return (
          <div key={category} id={`category-${category}`} className={styles.categorySection}>
            <div className={styles.categoryTitle}>{category}</div>
            <div className={styles.menuCards}>
              {categoryItems.length === 0 ? (
                <div className={styles.emptyCategory}>등록된 식사가 없습니다.</div>
              ) : (
                categoryItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.menuCard} ${item.goodsSt === 'S' ? styles.menuCardSoldOut : ''}`}
                  onClick={() => {
                    if (item.goodsSt !== 'S') {
                      onMenuClick(item);
                    }
                  }}
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
                  {item.goodsSt === 'S' && (
                    <div className={styles.soldOutOverlay}>
                      <div className={styles.soldOutText}>SOLD OUT</div>
                    </div>
                  )}
                </div>
              ))
              )}
            </div>
          </div>
        )})}
      </div>
    );
  }
);

MenuGrid.displayName = 'MenuGrid';

export default MenuGrid;
