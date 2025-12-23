'use client';

import React, { useState } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/modal/CommonModal.module.scss';
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

  const reasons = ['고객 요청'];

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
        onClick={handleConfirm}
      >
        주문 취소
      </button>
    </>
  );

  return (
    <CommonModalLayout title="주문 취소 사유" buttons={buttons}>
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
    </CommonModalLayout>
  );
};

export default CancelReasonModalContent;
