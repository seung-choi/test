import React from 'react';
import alertStyles from '@/styles/components/AlertModal.module.scss';

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
      className={alertStyles["alert-popup"]}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
