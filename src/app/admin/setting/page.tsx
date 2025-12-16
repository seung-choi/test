'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/pages/admin/setting.module.scss';
import ActionBar from '@/components/admin/lounge/drawer/setting/ActionBar';
import SalesInquiryActionBar from '@/components/admin/lounge/drawer/setting/SalesInquiryActionBar';
import SalesInquiryContent from '@/components/admin/lounge/drawer/setting/SalesInquiryContent';
import { SettingTab, SalesFilter } from '@/types/admin/setting.types';
import { mockOrderRecords } from '@/mock/orderMockData';

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('sales');
  const [currentFilter, setCurrentFilter] = useState<SalesFilter>({
    dateRange: {
      startDate: '2025-12-25',
      endDate: '2025-12-25',
    },
    status: '전체',
    caddyName: '',
    searchTerm: '',
  });

  // 통계 계산
  const stats = useMemo(() => {
    const totalOrders = mockOrderRecords.length;
    const completedOrders = mockOrderRecords.filter(r => r.status === '정산 완료').length;
    const canceledOrders = mockOrderRecords.filter(r => r.status === '취소').length;
    const totalAmount = mockOrderRecords
      .filter(r => r.status === '정산 완료')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      totalOrders,
      completedOrders,
      canceledOrders,
      totalAmount,
    };
  }, []);

  const handleFilterChange = (filter: SalesFilter) => {
    setCurrentFilter(filter);
    console.log('Filter changed:', filter);
    // TODO: API 호출하여 데이터 갱신
  };

  const handleExportExcel = () => {
    console.log('Export to Excel');
    // TODO: 엑셀 다운로드 로직 구현
    alert('엑셀 다운로드 준비 중입니다.');
  };

  const handleSort = (key: string) => {
    console.log('Sort by:', key);
    // TODO: 정렬 로직 구현
  };

  return (
    <div className={styles.settingPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>설정</h1>

        <div className={styles.startHouse}>
          <span className={styles.startHouseText}>스타트 하우스</span>
          <div className={styles.startHouseIcon} />
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'sales' ? styles.active : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            매출 조회
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'layout' ? styles.active : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            배치도 관리
          </button>
        </div>
      </div>

      <ActionBar>
        {activeTab === 'sales' && (
          <SalesInquiryActionBar
            filter={currentFilter}
            onFilterChange={handleFilterChange}
            stats={stats}
            onExportExcel={handleExportExcel}
          />
        )}
        {activeTab === 'layout' && (
          <div className={styles.comingSoon}>배치도 관리 액션바 (준비 중)</div>
        )}
      </ActionBar>

      <div className={styles.content}>
        {activeTab === 'sales' && (
          <SalesInquiryContent records={mockOrderRecords} onSort={handleSort} />
        )}
        {activeTab === 'layout' && (
          <div className={styles.comingSoon}>배치도 관리 콘텐츠 (준비 중)</div>
        )}
      </div>
    </div>
  );
};

export default SettingPage;
