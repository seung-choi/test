'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/components/order/modal/ManualRegisterModal.module.scss';

interface ManualRegisterModalProps {
  isOpen: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  hasError?: boolean;
}

const ManualRegisterModal: React.FC<ManualRegisterModalProps> = ({
  isOpen,
  value,
  onChange,
  onClose,
  onSubmit,
  isSubmitting = false,
  hasError = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      return;
    }
    if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!shouldRender) return null;

  const isActive = value.trim().length > 0;

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleClose}
    >
      <div
        className={styles.modalContainer}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.titleBar}>
          <div className={styles.title}>별도 등록</div>
        </div>

        <div className={styles.body}>
          <input
            type="text"
            className={`${styles.nameInput} ${hasError ? styles.nameInputError : ''}`}
            placeholder="테이블명을 입력해주세요"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.closeButton} onClick={handleClose}>
            닫기
          </button>
          <button
            type="button"
            className={`${styles.submitButton} ${isActive ? styles.submitButtonActive : ''}`}
            onClick={onSubmit}
            disabled={!isActive || isSubmitting}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualRegisterModal;
