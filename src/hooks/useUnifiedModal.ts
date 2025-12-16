import { useRecoilState } from 'recoil';
import { MessageFormData } from '@/types';
import {
  cancelModalState,
  messageModalState,
  confirmModalState
} from '@/lib/recoil/modalAtom';

const useUnifiedModal = () => {
  const [cancelModal, setCancelModal] = useRecoilState(cancelModalState);
  const [messageModal, setMessageModal] = useRecoilState(messageModalState);
  const [confirmModal, setConfirmModal] = useRecoilState(confirmModalState);

  // 취소 사유 모달
  const openCancelModal = (onConfirm: (reason: string) => void, onCancel?: () => void) => {
    setCancelModal({
      isShow: true,
      onConfirm,
      onCancel,
    });
  };

  const closeCancelModal = () => {
    setCancelModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  // 메시지 모달
  const openMessageModal = (
    title: string,
    recipients: string[],
    onSubmit: (data: MessageFormData) => void,
    onCancel?: () => void
  ) => {
    setMessageModal({
      isShow: true,
      title,
      recipients,
      onSubmit,
      onCancel,
    });
  };

  const closeMessageModal = () => {
    setMessageModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  // 편의 함수: 메시지 보내기 모달
  const openSendMessageModal = (
    recipients: string[],
    onSend: (data: MessageFormData) => void,
    onCancel?: () => void
  ) => {
    openMessageModal('메시지 보내기', recipients, onSend, onCancel);
  };

  // 편의 함수: 주문 취소 모달 (취소 사유 선택)
  const openCancelOrderModal = (
    onConfirm: (reason: string) => void,
    onCancel?: () => void
  ) => {
    openCancelModal(onConfirm, onCancel);
  };

  // 확인 모달
  const openConfirmModal = (
    title: string,
    desc: string,
    onConfirm: () => void,
    onCancel?: () => void,
    okBtnLabel?: string,
    cancleBtnLabel?: string
  ) => {
    setConfirmModal({
      isShow: true,
      title,
      desc,
      onConfirm,
      onCancel,
      okBtnLabel,
      cancleBtnLabel,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  return {
    // 취소 사유 모달
    cancelModal,
    openCancelModal,
    closeCancelModal,
    openCancelOrderModal,

    // 메시지 모달
    messageModal,
    openMessageModal,
    closeMessageModal,
    openSendMessageModal,

    // 확인 모달
    confirmModal,
    openConfirmModal,
    closeConfirmModal,
  };
};

export default useUnifiedModal;