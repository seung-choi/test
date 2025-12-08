'use client';

import React, { useState } from 'react';
import styles from '@/styles/components/CancelModal.module.scss';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: (reason: string) => void;
  title?: string;
}

type CancelReason = '고객 요청' | '품절' | '판매중단' | '재고소진';

const CancelModal: React.FC<CancelModalProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onCancel,
                                                   title = '주문 취소 사유'
                                                 }) => {
  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(null);

  const reasons: CancelReason[] = ['고객 요청', '품절', '판매중단', '재고소진'];

  const handleReasonClick = (reason: CancelReason) => {
    setSelectedReason(reason);
  };

  const handleCancelOrder = () => {
    if (selectedReason) {
      onCancel(selectedReason);
      setSelectedReason(null);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeIcon}
            onClick={handleClose}
            aria-label="모달 닫기"
          >
          </button>
        </div>

        <div className={styles.divider}></div>

        {/* Reasons */}
        <div className={styles.reasonsContainer}>
          <div
            className={`${styles.reasonItem} ${styles.mainReason} ${
              selectedReason === '고객 요청' ? styles.selected : ''
            }`}
            onClick={() => handleReasonClick('고객 요청')}
          >
            <span className={styles.reasonText}>고객 요청</span>
          </div>

          <div className={styles.subReasonsGrid}>
            {reasons.slice(1).map((reason) => (
              <div
                key={reason}
                className={`${styles.reasonItem} ${styles.subReason} ${
                  selectedReason === reason ? styles.selected : ''
                }`}
                onClick={() => handleReasonClick(reason)}
              >
                <span className={styles.reasonText}>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
          >
            닫기
          </button>
          <button
            className={`${styles.cancelButton} ${!selectedReason ? styles.disabled : ''}`}
            onClick={handleCancelOrder}
            disabled={!selectedReason}
          >
            주문 취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;