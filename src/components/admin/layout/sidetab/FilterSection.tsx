import React from 'react';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import { OrderCounts } from '@/types';
import { BillOrderStatus } from '@/types/bill.type';
import type { FilterSectionProps } from '@/types';

const FilterSection: React.FC<FilterSectionProps> = ({
  activeFilter,
  orderCounts,
  hasNotification,
  onFilterChange,
}) => {
  const filterItems: { key: BillOrderStatus; label: string; count: number }[] = [
    { key: 'R', label: '접수', count: orderCounts.R },
    { key: 'P', label: '진행중', count: orderCounts.P },
    { key: 'N', label: '취소', count: orderCounts.N },
    { key: 'Y', label: '완료', count: orderCounts.Y },
  ];

  return (
    <div className={styles.filtersContainer}>
      {filterItems.map((item) => (
        <div
          key={item.key}
          className={`${styles.filterButton} ${
            activeFilter === item.key ? styles.active : ''
          }`}
          onClick={() => onFilterChange(item.key)}
        >
          <div className={styles.filterLabel}>
            {item.label}
            {item.key === 'R' && orderCounts.R > 0 && (
              <div className={styles.notificationDot}>
                <div className={styles.notificationDotBg}>
                  <div className={styles.notificationDotText}>N</div>
                </div>
              </div>
            )}
          </div>
          {(item.key === 'R' || activeFilter === item.key) && (
            <div className={styles.filterCount}>({item.count})</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterSection;
