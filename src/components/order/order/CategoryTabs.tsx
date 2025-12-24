'use client';

import React from 'react';
import styles from '@/styles/components/order/order/CategoryTabs.module.scss';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className={styles.categoryContainer}>
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
  );
};

export default CategoryTabs;
