
'use client';

import React, { useState } from 'react';
import styles from '@/styles/components/admin/lounge/drawer/SalesManagement.module.scss';
import { SalesFilter, SalesStats } from '@/types/admin/setting.types';

interface SalesFilterActionBarProps {
  filter: SalesFilter;
  onFilterChange: (filter: SalesFilter) => void;
  stats: SalesStats;
  onExportExcel: () => void;
}

const SalesFilterActionBar: React.FC<SalesFilterActionBarProps> = ({
                                                                     filter,
                                                                     onFilterChange,
                                                                     stats,
                                                                     onExportExcel,
                                                                   }) => {
  const [localFilter, setLocalFilter] = useState(filter);

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilter = {
      ...localFilter,
      dateRange: {
        ...localFilter.dateRange,
        [field]: value
      }
    };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleStatusChange = (status: string) => {
    const newFilter = { ...localFilter, status };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleCaddyNameChange = (caddyName: string) => {
    const newFilter = { ...localFilter, caddyName };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleSearchTermChange = (searchTerm: string) => {
    const newFilter = { ...localFilter, searchTerm };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleSearch = () => {
    onFilterChange(localFilter);
  };

  return (
      <div className={styles.salesFilterActionBar}>
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <div className={styles.dateLabel}>
              <div className={styles.dateLabelText}>날짜 조회</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.dateRangeContainer}>
              <div className={styles.dateDisplay}>
                <div className={styles.dateText}>{localFilter.dateRange.startDate}</div>
              </div>
              <div className={styles.dateDisplay}>
                <div className={styles.dateText}>~</div>
              </div>
              <div className={styles.dateDisplay}>
                <div className={styles.dateText}>{localFilter.dateRange.endDate}</div>
              </div>
              <div className={styles.calendarIcon}>
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none">
                  <path d="M24.25 5.16667H6.75C5.5074 5.16667 4.5 6.17406 4.5 7.41667V24.9167C4.5 26.1593 5.5074 27.1667 6.75 27.1667H24.25C25.4926 27.1667 26.5 26.1593 26.5 24.9167V7.41667C26.5 6.17406 25.4926 5.16667 24.25 5.16667Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 2.91667V7.41667" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 2.91667V7.41667" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 11.9167H26.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className={styles.searchButton} onClick={handleSearch}>
              <div className={styles.searchButtonText}>검색</div>
            </div>
          </div>
          <div className={styles.actionSection}>
            <button className={styles.excelButton} onClick={onExportExcel}>
              <img src="/images/admin/excel.png" alt="엑셀" className={styles.excelIcon} />
              <div className={styles.excelButtonText}>엑셀로 내보내기</div>
            </button>
          </div>
        </div>



        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <div className={styles.statLabelText}>총 주문 건수</div>
            </div>
            <div className={styles.statValue}>
              <div className={styles.statValueText}>{stats.totalOrders}건</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <div className={styles.statLabelText}>정산완료 건</div>
            </div>
            <div className={styles.statValue}>
              <div className={styles.statValueText}>{stats.completedOrders}건</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <div className={styles.statLabelText}>주문 취소 건</div>
            </div>
            <div className={styles.statValue}>
              <div className={styles.statValueText}>{stats.canceledOrders}건</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <div className={styles.statLabelText}>총 주문금액</div>
            </div>
            <div className={styles.statValue}>
              <div className={styles.statValueText}>{stats.totalAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SalesFilterActionBar;