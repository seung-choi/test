'use client';

import React, { useState } from 'react';
import styles from '@/styles/components/modal/CancelReasonModal.module.scss';

interface CancelReasonModalContentProps {
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const CancelReasonModalContent: React.FC<CancelReasonModalContentProps> = ({
  onConfirm,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  const reasons = ['고객 요청', ];

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(selectedReason === reason ? '' : reason);
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      alert('취소 사유를 선택해주세요.');
      return;
    }
    onConfirm(selectedReason);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>주문 취소 사유</div>
      </div>

      <div className={styles.content}>
        <div className={`${styles.reasonList} ${reasons.length === 1 ? styles.singleItem : styles.multipleItems}`}>
          {reasons.map((reason) => (
              <button
                  key={reason}
                  className={`${styles.reasonButton} ${
                      selectedReason === reason ? styles.selected : ''
                  }`}
                  onClick={() => handleReasonSelect(reason)}
              >
                {reason}
              </button>
          ))}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onClose}
        >
          닫기
        </button>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
        >
          주문 취소
        </button>
      </div>
    </div>
  );
};

export default CancelReasonModalContent;
