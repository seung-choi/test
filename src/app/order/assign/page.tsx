'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/pages/order/assign.module.scss';
import { useBillErpList } from '@/hooks/api';

const formatTime = (value?: string | null): string => {
  if (!value) return '-';
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return value;
};

const OrderAssignPage: React.FC = () => {
  const isClient = typeof window !== 'undefined';
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState('-');
  const { erpBookingList = [] } = useBillErpList({ enabled: isClient });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get('tableNumber') || '-');
  }, [isClient]);

  const rows = useMemo(() => {
    return erpBookingList.map((booking) => ({
      teeOff: formatTime(booking.bookingTm),
      players: booking.playerList?.map((player) => player.playerNm).join(', ') || '-',
      caddy: booking.caddyNm || '-',
      group: booking.bookingsNm || '-',
    }));
  }, [erpBookingList]);

  const handleBack = () => {
    router.push('/order/main');
  };

  return (
    <div className={styles.assignPage}>
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
          <img src='/assets/image/global/arrow/arrow-back.svg' alt={'뒤로가기'}/>
        </button>
        <div className={styles.title}>테이블 지정</div>
        <div className={styles.tableNumber}>{tableNumber}</div>
        <button type="button" className={styles.secondaryButton}>별도 등록</button>
      </header>

      <div className={styles.content}>
        <div className={styles.tableHeader}>
          <div className={styles.colSelect}>선택</div>
          <div className={styles.colTime}>티오프</div>
          <div className={styles.colPlayers}>내장객명</div>
          <div className={styles.colCaddy}>캐디명</div>
          <div className={styles.colGroup}>단체명</div>
        </div>
        <div className={styles.tableBody}>
          {rows.length === 0 ? (
            <div className={styles.emptyState}>지정 가능한 내장객이 없습니다</div>
          ) : (
            rows.map((row, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={`${row.teeOff}-${index}`}
                  type="button"
                  className={`${styles.tableRow} ${isSelected ? styles.selectedRow : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className={styles.colSelect}>
                    <span className={`${styles.radio} ${isSelected ? styles.radioOn : styles.radioOff}`} />
                  </div>
                  <div className={styles.colTime}>{row.teeOff}</div>
                  <div className={styles.colPlayers}>{row.players}</div>
                  <div className={styles.colCaddy}>{row.caddy}</div>
                  <div className={styles.colGroup}>{row.group}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.primaryButton}>등록</button>
      </div>
    </div>
  );
};

export default OrderAssignPage;
