import React from 'react';
import styles from '@/styles/components/common/ErpToast.module.scss';
import type { ErpToastProps } from '@/types';

const ErpToast: React.FC<ErpToastProps> = ({ message, variant = 'success' }) => {
  return (
    <div className={styles.erpToast}>
      <div
        className={`${styles.erpToastContent} ${
          variant === 'success'
            ? styles.toastSuccess
            : variant === 'error'
              ? styles.toastError
              : styles.toastEmpty
        }`}
      >
        <div className={styles.erpToastText}>{message}</div>
      </div>
    </div>
  );
};

export default ErpToast;
