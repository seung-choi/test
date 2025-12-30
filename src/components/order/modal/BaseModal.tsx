'use client';

import React from 'react';
import styles from '@/styles/components/order/modal/BaseModal.module.scss';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        style={width ? { width: `${width}px` } : undefined}
      >
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <img src="/assets/image/global/arrow/arrow-back.svg" alt="뒤로가기" />
          </button>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default BaseModal;
