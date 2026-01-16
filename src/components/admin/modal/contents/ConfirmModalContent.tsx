'use client';

import React from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/Modal.module.scss';
import type { ConfirmModalContentProps } from '@/types';

const ConfirmModalContent: React.FC<ConfirmModalContentProps> = ({
  title = '확인',
  desc,
  okBtnLabel = '확인',
  cancelBtnLabel = '취소',
  onConfirm,
  onCancel,
}) => {
  const buttons = (
    <>
      <button
        type="button"
        className={commonStyles.cancelButton}
        onClick={onCancel}
      >
        {cancelBtnLabel}
      </button>
      <button
        type="button"
        className={commonStyles.confirmButton}
        onClick={onConfirm}
      >
        {okBtnLabel}
      </button>
    </>
  );

  return (
    <CommonModalLayout title={title} buttons={buttons}>
      <p className={styles['alert-popup-desc']}>{desc}</p>
    </CommonModalLayout>
  );
};

export default ConfirmModalContent;
