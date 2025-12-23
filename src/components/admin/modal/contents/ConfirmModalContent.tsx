'use client';

import React from 'react';
import styles from '@/styles/components/Modal.module.scss';
import { Button } from '@/components/admin/common/Button';

interface ConfirmModalContentProps {
  title?: string;
  desc: string;
  okBtnLabel?: string;
  cancelBtnLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModalContent: React.FC<ConfirmModalContentProps> = ({
  title,
  desc,
  okBtnLabel = '확인',
  cancelBtnLabel = '취소',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className={styles["alert-popup-inner"]}>
      {title && <h3 className={styles["alert-popup-title"]}>{title}</h3>}
      <p className={styles["alert-popup-desc"]}>{desc}</p>
      <div className={styles["alert-popup-button-container"]}>
        <Button
          type="button"
          label={cancelBtnLabel}
          onClick={onCancel}
        />
        <Button
          type="button"
          label={okBtnLabel}
          primary={true}
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

export default ConfirmModalContent;
