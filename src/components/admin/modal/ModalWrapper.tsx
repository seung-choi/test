import React from 'react';
import styles from '@/styles/components/Modal.module.scss';

interface ModalWrapperProps {
  isShow: boolean;
  onClose: () => void;
  enableOverlayClick?: boolean;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isShow,
  onClose,
  enableOverlayClick = true,
  children,
}) => {
  if (!isShow) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (enableOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.alertPopup}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
