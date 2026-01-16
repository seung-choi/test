'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/pages/order/assign.module.scss';
import OrderHeaderShell from '@/components/order/common/OrderHeaderShell';
import ManualRegisterModal from '@/components/order/modal/ManualRegisterModal';
import { useBillErpList, usePostBill } from '@/hooks/api';
import { useToast } from '@/hooks/common/useToast';

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
  const [tableId, setTableId] = useState<number | null>(null);
  const { erpBookingList = [] } = useBillErpList({ enabled: isClient });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualError, setManualError] = useState(false);
  const { showToast } = useToast();
  const { mutate: postBill, isPending: isPosting } = usePostBill();

  useEffect(() => {
    if (!isClient) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get('tableNumber') || '-');
    const tableIdParam = params.get('tableId');
    if (tableIdParam) {
      const parsed = Number(tableIdParam);
      setTableId(Number.isFinite(parsed) ? parsed : null);
    } else {
      setTableId(null);
    }
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

  const handleManualOpen = () => {
    setManualName('');
    setManualError(false);
    setIsManualModalOpen(true);
  };

  const handleManualClose = () => {
    setIsManualModalOpen(false);
  };

  const handleManualSubmit = () => {
    const trimmed = manualName.trim();
    if (!trimmed) {
      setManualError(true);
      showToast('테이블명을 입력해주세요.', 'error');
      return;
    }
    if (!tableId) {
      showToast('테이블 정보가 없습니다.', 'error');
      return;
    }

    postBill(
      {
        tableId,
        bookingNm: trimmed,
        bookingId: null,
        bookingTm: null,
        bookingsNm: null,
        bookingErp: null,
        playerList: null,
      },
      {
        onSuccess: () => {
          const params = new URLSearchParams({
            tableNumber,
            groupName: trimmed,
            members: '',
          });
          setIsManualModalOpen(false);
          router.push(`/order/order?${params.toString()}`);
        },
      }
    );
  };

  return (
    <div className={styles.assignPage}>
      <OrderHeaderShell
        variant="assign"
        left={(
          <>
            <button type="button" className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
              <img src='/assets/image/global/arrow/arrow-back.svg' alt={'뒤로가기'}/>
            </button>
            <div className={styles.title}>테이블 지정</div>
          </>
        )}
        center={<div className={styles.tableNumber}>{tableNumber}</div>}
        right={<button type="button" className={styles.secondaryButton} onClick={handleManualOpen}>별도 등록</button>}
      />

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

      <ManualRegisterModal
        isOpen={isManualModalOpen}
        value={manualName}
        onChange={(value) => {
          setManualName(value);
          if (manualError) setManualError(false);
        }}
        onClose={handleManualClose}
        onSubmit={handleManualSubmit}
        isSubmitting={isPosting}
        hasError={manualError}
      />
    </div>
  );
};

export default OrderAssignPage;
