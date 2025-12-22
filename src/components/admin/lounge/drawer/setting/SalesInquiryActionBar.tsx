'use client';

import React, { useState, useRef } from 'react';
import styles from '@/styles/components/admin/lounge/drawer/SalesManagement.module.scss';
import { SalesFilter, SalesStats } from '@/types/admin/setting.types';
import DateRangePicker from '@/components/admin/common/DateRangePicker';

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarTriggerRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (startDate: string, endDate: string) => {
    const newFilter = {
      ...localFilter,
      dateRange: {
        startDate,
        endDate
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
            <div className={styles.dateRangeContainer} style={{ position: 'relative' }}>
              <div className={styles.dateDisplay}>
                <div className={styles.dateText}>{localFilter.dateRange.startDate}</div>
              </div>
              <div className={styles.dateDisplay}>
                <div className={styles.dateText}>~</div>
              </div>
              <div className={styles.dateDisplay}>
                <div className={styles.dateText}>{localFilter.dateRange.endDate}</div>
              </div>
              <div
                className={styles.calendarIcon}
                ref={calendarTriggerRef}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <img src="/assets/image/admin/calendar.svg" alt="calendar" />
              </div>
              <DateRangePicker
                startDate={localFilter.dateRange.startDate}
                endDate={localFilter.dateRange.endDate}
                onDateChange={handleDateChange}
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                triggerRef={calendarTriggerRef}
              />
            </div>
            <div className={styles.searchButton} onClick={handleSearch}>
              <div className={styles.searchButtonText}>검색</div>
            </div>
          </div>
          <button className={styles.excelButton} onClick={onExportExcel}>
            <img src="/assets/image/admin/excel.svg" alt="엑셀" className={styles.excelIcon} />
            <div className={styles.excelButtonText}>엑셀로 내보내기</div>
          </button>
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