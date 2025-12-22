/**
 * 모달 핸들러를 생성하는 유틸리티 함수
 */

interface CreateModalHandlersParams<T = any> {
  onSubmit?: (data: T) => void;
  onCancel?: () => void;
  onConfirm?: (data?: T) => void;
  onSelect?: (data: T) => void;
  closeModal: () => void;
}

export const createModalHandlers = <T = any>({
  onSubmit,
  onCancel,
  onConfirm,
  onSelect,
  closeModal,
}: CreateModalHandlersParams<T>) => {
  const handleSubmit = (data: T) => {
    onSubmit?.(data);
    closeModal();
  };

  const handleConfirm = (data?: T) => {
    onConfirm?.(data);
    closeModal();
  };

  const handleSelect = (data: T) => {
    onSelect?.(data);
    closeModal();
  };

  const handleClose = () => {
    onCancel?.();
    closeModal();
  };

  return {
    handleSubmit,
    handleConfirm,
    handleSelect,
    handleClose,
  };
};
