import React from 'react';
import styles from '@/styles/components/admin/layout/SideTab.module.scss';
import { OrderCounts } from '@/types';

interface FilterSectionProps {
  activeFilter: string;
  orderCounts: OrderCounts;
  hasNotification: boolean;
  onFilterChange: (filter: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  activeFilter,
  orderCounts,
  hasNotification,
  onFilterChange,
}) => {
  const filterItems = [
    { key: 'order', label: '접수', count: orderCounts.order },
    { key: 'accept', label: '진행중', count: orderCounts.accept },
    { key: 'cancel', label: '취소', count: orderCounts.cancel },
    { key: 'complete', label: '완료', count: orderCounts.complete },
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
            {hasNotification && item.key === 'order' && (
              <div className={styles.notificationDot}>
                <div className={styles.notificationDotBg}>
                  <div className={styles.notificationDotText}>N</div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.filterCount}>({item.count})</div>
        </div>
      ))}
    </div>
  );
};

export default FilterSection;
