'use client';

import React, { useState, useMemo } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/ErpLinkModal.module.scss';
import { useBillErpList } from '@/hooks/api';
import { ErpBookingResponse, ErpPlayerResponse } from '@/types/api/bill.type';
import { ErpLinkSelection } from '@/types';
import { formatTime } from '@/utils';
import type { ErpLinkModalContentProps } from '@/types';

const ErpLinkModalContent: React.FC<ErpLinkModalContentProps> = ({
  onLinkErp,
  onManual,
  onClose,
}) => {
  const { erpBookingList = [], isLoading } = useBillErpList({ enabled: true });
  const [selectedBookingErp, setSelectedBookingErp] = useState<string | null>(null);
  const [selectedPlayerErp, setSelectedPlayerErp] = useState<string | null>(null);

  const selectedBooking = useMemo(() => {
    if (!selectedBookingErp) return null;
    return erpBookingList.find((b) => b.bookingErp === selectedBookingErp) || null;
  }, [erpBookingList, selectedBookingErp]);

  const selectedPlayer = useMemo(() => {
    if (!selectedBooking || !selectedPlayerErp) return null;
    return selectedBooking.playerList.find((p) => p.playerErp === selectedPlayerErp) || null;
  }, [selectedBooking, selectedPlayerErp]);

  const canLinkErp = selectedBooking && selectedPlayer;

  const handleRowClick = (booking: ErpBookingResponse) => {
    if (selectedBookingErp === booking.bookingErp) {
      setSelectedBookingErp(null);
      setSelectedPlayerErp(null);
    } else {
      setSelectedBookingErp(booking.bookingErp);
      setSelectedPlayerErp(null);
    }
  };

  const handlePlayerClick = (e: React.MouseEvent, booking: ErpBookingResponse, player: ErpPlayerResponse) => {
    e.stopPropagation();
    if (selectedBookingErp !== booking.bookingErp) {
      setSelectedBookingErp(booking.bookingErp);
    }
    if (selectedPlayerErp === player.playerErp) {
      setSelectedPlayerErp(null);
    } else {
      setSelectedPlayerErp(player.playerErp);
    }
  };

  const handleLinkErp = () => {
    if (!selectedBooking || !selectedPlayer) return;
    onLinkErp({
      bookingErp: selectedBooking.bookingErp,
      playerNm: selectedPlayer.playerNm,
      playerErp: selectedPlayer.playerErp,
    });
  };

  const buttons = (
    <>
      <button
        type="button"
        className={commonStyles.cancelButton}
        onClick={onClose}
      >
        닫기
      </button>
      <button
        type="button"
        className={commonStyles.confirmButton}
        onClick={onManual}
      >
        비연동(수동)
      </button>
      <button
        type="button"
        className={canLinkErp ? commonStyles.confirmButton : styles.disabledButton}
        onClick={handleLinkErp}
        disabled={!canLinkErp}
      >
        ERP 연동
      </button>
    </>
  );

  return (
    <CommonModalLayout
      title="ERP 연동"
      buttons={buttons}
      className={styles.erpLinkContainer}
    >
      <div className={styles.erpLinkContent}>
        <div className={styles.erpTable}>
          <div className={styles.tableHeader}>
            <div className={`${styles.cell} ${styles.selectColumn}`}>선택</div>
            <div className={`${styles.cell} ${styles.timeColumn}`}>티오프</div>
            <div className={`${styles.cell} ${styles.playersColumn}`}>내장객명</div>
            <div className={`${styles.cell} ${styles.caddyColumn}`}>캐디명</div>
            <div className={`${styles.cell} ${styles.groupColumn}`}>단체명</div>
          </div>
          <div className={styles.tableBody}>
            {isLoading ? (
              <div className={styles.loadingContainer}>로딩 중...</div>
            ) : erpBookingList.length === 0 ? (
              <div className={styles.emptyTable}>예약 정보가 없습니다.</div>
            ) : (
              erpBookingList.map((booking) => {
                const isRowSelected = selectedBookingErp === booking.bookingErp;
                return (
                  <div
                    key={booking.bookingErp}
                    className={`${styles.tableRow} ${isRowSelected ? styles.selectedRow : ''}`}
                    onClick={() => handleRowClick(booking)}
                  >
                    <div className={`${styles.cell} ${styles.selectColumn}`}>
                      <span
                        className={`${styles.rowCheckbox} ${isRowSelected ? styles.checked : ''}`}
                      />
                    </div>
                    <div className={`${styles.cell} ${styles.timeColumn}`}>
                      <span className={styles.cellText}>{formatTime(booking.bookingTm)}</span>
                    </div>
                    <div className={`${styles.cell} ${styles.playersColumn}`}>
                      {booking.playerList.map((player) => {
                        const isPlayerSelected = isRowSelected && selectedPlayerErp === player.playerErp;
                        return (
                          <div
                            key={player.playerErp}
                            className={styles.playerItem}
                            onClick={(e) => handlePlayerClick(e, booking, player)}
                          >
                            <span
                              className={`${styles.playerCheckbox} ${isPlayerSelected ? styles.checked : ''}`}
                            />
                            <span className={styles.playerName}>{player.playerNm}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className={`${styles.cell} ${styles.caddyColumn}`}>
                      <span className={styles.cellText}>{booking.caddyNm || '-'}</span>
                    </div>
                    <div className={`${styles.cell} ${styles.groupColumn}`}>
                      <span className={styles.cellText}>{booking.bookingsNm || '-'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </CommonModalLayout>
  );
};

export default ErpLinkModalContent;
