'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { toastState } from '@/lib/recoil/toastAtom';
import styles from '@/styles/components/common/GlobalToast.module.scss';

const GlobalToast: React.FC = () => {
  const toast = useRecoilValue(toastState);

  if (!toast.isShow) return null;

  const variantClass = {
    success: styles.toastSuccess,
    error: styles.toastError,
    info: styles.toastInfo,
  }[toast.variant];

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toastContent} ${variantClass}`}>
        <span className={styles.toastText}>{toast.message}</span>
      </div>
    </div>
  );
};

export default GlobalToast;
