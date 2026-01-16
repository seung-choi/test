'use client';

import React, { useRef } from 'react';
import styles from '@/styles/components/order/order/CategoryTabs.module.scss';
import { CategoryType } from '@/types';
import { useHorizontalScroll } from '@/hooks/common/useScrollManagement';
import type { CategoryTabsProps } from '@/types';

/**
 * 카테고리 탭 컴포넌트
 */
const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleScroll } = useHorizontalScroll();

  return (
    <div className={styles.categoryWrapper}>
      {categories.length > 5 && (
        <button
          className={styles.scrollButton}
          onClick={() => handleScroll(containerRef, 'left')}
          aria-label="이전 카테고리"
        >
          ‹
        </button>
      )}
      <div className={styles.categoryContainer} ref={containerRef}>
      {categories.map((category) => (
        <div
          key={category}
          className={`${styles.categoryTab} ${
            activeCategory === category ? styles.active : ''
          }`}
          onClick={() => onCategoryChange(category)}
        >
          <span className={styles.categoryText}>{category}</span>
        </div>
      ))}
      </div>
      {categories.length > 5 && (
        <button
          className={styles.scrollButton}
          onClick={() => handleScroll(containerRef, 'right')}
          aria-label="다음 카테고리"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default CategoryTabs;
