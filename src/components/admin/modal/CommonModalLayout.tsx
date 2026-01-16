'use client';

import React from 'react';
import styles from '@/styles/components/admin/modal/CommonModal.module.scss';
import type { CommonModalLayoutProps } from '@/types';

const CommonModalLayout: React.FC<CommonModalLayoutProps> = ({
  title,
  children,
  buttons,
  className = '',
  contentClassName = '',
  headerRight,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {headerRight && <div className={styles.headerRight}>{headerRight}</div>}
      </div>
      <div className={`${styles.content} ${contentClassName}`}>
        {children}
      </div>
      {buttons && (
        <div className={styles.buttonContainer}>
          {buttons}
        </div>
      )}
    </div>
  );
};

export default CommonModalLayout;
