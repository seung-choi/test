'use client';

import React, { useState } from 'react';
import styles from '@/styles/pages/admin/setting.module.scss';
import { SalesFilter, SalesStats } from '@/types/admin/setting.types';

interface SalesInquiryActionBarProps {
  onFilterChange: (filter: SalesFilter) => void;
  stats: SalesStats;
  onExportExcel: () => void;
}

const SalesInquiryActionBar: React.FC<SalesInquiryActionBarProps> = ({
  onFilterChange,
  stats,
  onExportExcel,
}) => {
  const [filter, setFilter] = useState<SalesFilter>({
    startDate: '2025-12-25',
    endDate: '2025-12-25',
  });

  const handleSearch = () => {
    onFilterChange(filter);
  };

  return (
    <>
      <div className={styles.filterSection}>
        <div className={styles.filterLabel}>날짜 조회</div>
        <div className={styles.filterDivider} />
        <div className={styles.filterContent}>
          <div className={styles.dateDisplay}>
            <span className={styles.dateText}>{filter.startDate}</span>
            <span className={styles.dateSeparator}>~</span>
            <span className={styles.dateText}>{filter.endDate}</span>
            <button className={styles.calendarButton}>
              <svg width="31" height="31" viewBox="0 0 31 31" fill="none">
                <path d="M23.25 25.83H3.88V1.29H23.25V25.83Z" fill="black"/>
              </svg>
            </button>
          </div>
        </div>
        <button className={styles.searchButton} onClick={handleSearch}>
          검색
        </button>
      </div>

      <button className={styles.excelButton} onClick={onExportExcel}>
        <svg width="28" height="27" viewBox="0 0 28 27" fill="none">
          <rect width="28" height="27" fill="white"/>
        </svg>
        <span>엑셀로 내보내기</span>
      </button>

      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>총 주문 건수</div>
          <div className={styles.statValue}>{stats.totalOrders}건</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>정산완료 건</div>
          <div className={styles.statValue}>{stats.completedOrders}건</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>주문 취소 건</div>
          <div className={styles.statValue}>{stats.canceledOrders}건</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>총 주문금액</div>
          <div className={styles.statValue}>{stats.totalAmount.toLocaleString()}</div>
        </div>
      </div>
    </>
  );
};

export default SalesInquiryActionBar;
