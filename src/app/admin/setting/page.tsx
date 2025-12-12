'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/pages/admin/setting.module.scss';
import ActionBar from '@/components/admin/setting/ActionBar';
import SalesInquiryActionBar from '@/components/admin/setting/SalesInquiryActionBar';
import SalesInquiryContent from '@/components/admin/setting/SalesInquiryContent';
import { SettingTab, SalesFilter, OrderRecord } from '@/types/admin/setting.types';

// Mock 데이터 - 더 많은 데이터 추가
const mockOrderRecords: OrderRecord[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  orderDate: '2025-12-25',
  teeOff: '11:24',
  caddyName: '김은숙',
  customers: ['정철', '박지원', '허근영', '이지원'],
  groupName: '행복회',
  totalItems: i === 1 ? 2 : 10,
  menuDetails: i === 1 ? '잡채, 탕수육' : '갈비탕(2), 햄버거(1), 한우버거(3)',
  totalAmount: i === 1 || i === 2 ? 0 : 150000,
  status: i === 1 || i === 2 ? '취소' : '정산 완료',
  cancelReason: i === 1 ? '고객 요청' : i === 2 ? '품절' : undefined,
}));

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('sales');
  const [currentFilter, setCurrentFilter] = useState<SalesFilter>({
    startDate: '2025-12-25',
    endDate: '2025-12-25',
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
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>설정</h1>

        {/* 스타트 하우스 선택 */}
        <div className={styles.startHouse}>
          <span className={styles.startHouseText}>스타트 하우스</span>
          <div className={styles.startHouseIcon} />
        </div>

        {/* 탭 메뉴 */}
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

      {/* 액션바 - 탭에 따라 다른 내용 렌더링 */}
      <ActionBar>
        {activeTab === 'sales' && (
          <SalesInquiryActionBar
            onFilterChange={handleFilterChange}
            stats={stats}
            onExportExcel={handleExportExcel}
          />
        )}
        {activeTab === 'layout' && (
          <div className={styles.comingSoon}>배치도 관리 액션바 (준비 중)</div>
        )}
      </ActionBar>

      {/* 콘텐츠 - 탭에 따라 다른 내용 렌더링 */}
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
