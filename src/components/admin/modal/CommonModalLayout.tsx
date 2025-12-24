'use client';

import React from 'react';
import styles from '@/styles/components/admin/modal/CommonModal.module.scss';

interface CommonModalLayoutProps {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const CommonModalLayout: React.FC<CommonModalLayoutProps> = ({
  title,
  children,
  buttons,
  headerRight,
  className = '',
  contentClassName = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {headerRight}
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
