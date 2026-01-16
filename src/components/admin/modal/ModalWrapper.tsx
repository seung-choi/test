import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/admin/modal/Modal.module.scss';
import { useScrollLock } from '@/hooks/common/useScrollManagement';
import type { ModalWrapperProps } from '@/types';

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isShow,
  onClose,
  enableOverlayClick = true,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useScrollLock(isVisible);

  useEffect(() => {
    if (isShow) {
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isShow, isVisible]);

  if (!isVisible) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (enableOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.alertPopup} ${isClosing ? styles.closing : ''}`}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
