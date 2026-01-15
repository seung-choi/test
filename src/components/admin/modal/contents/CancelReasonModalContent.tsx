'use client';

import React, { useState } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/CancelReasonModal.module.scss';
import {useCategoryList} from "@/hooks/api";

interface CancelReasonModalContentProps {
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const CancelReasonModalContent: React.FC<CancelReasonModalContentProps> = ({
  onConfirm,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
    const { data: categoryReasons = [] } = useCategoryList('REASON');

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
      <div className={`${styles.reasonList} ${categoryReasons.length === 1 ? styles.singleItem : styles.multipleItems}`}>
        {categoryReasons.map((reason) => (
          <button
            key={reason.categoryId}
            className={`${styles.reasonButton} ${
              selectedReason === reason.categoryNm ? styles.selected : ''
            }`}
            onClick={() => handleReasonSelect(reason.categoryNm)}
          >
            {reason.categoryNm}
          </button>
        ))}
      </div>
    </CommonModalLayout>
  );
};

export default CancelReasonModalContent;
