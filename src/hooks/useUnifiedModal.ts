import { useRecoilState } from 'recoil';
import { MessageFormData } from '@/types';
import { alertModalState, messageModalState } from '@/lib/recoil/modalAtom';

const useUnifiedModal = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [messageModal, setMessageModal] = useRecoilState(messageModalState);

  const openAlertModal = (modalData: Omit<typeof alertModal, 'isShow'>) => {
    setAlertModal({
      ...modalData,
      isShow: true,
    });
  };

  const closeAlertModal = () => {
    setAlertModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  const openMessageModal = (modalData: Omit<typeof messageModal, 'isShow'>) => {
    setMessageModal({
      ...modalData,
      isShow: true,
    });
  };

  const closeMessageModal = () => {
    setMessageModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  const openCancelOrderModal = (onConfirm: () => void, onCancel?: () => void) => {
    openMessageModal({
      mode: 'cancel',
      title: '주문 취소',
      desc: '정말로 주문을 취소하시겠습니까?',
      onSubmit: onConfirm,
      onCancel: onCancel,
      okBtnLabel: '예, 취소합니다',
      cancleBtnLabel: '아니오',
    });
  };

  const openSendMessageModal = (
    recipients: string[],
    onSend: (data: MessageFormData) => void,
    onCancel?: () => void
  ) => {
    openMessageModal({
      mode: 'message',
      title: '메시지 보내기',
      recipients,
      onSubmit: onSend,
      onCancel,
    });
  };

  return {
    alertModal,
    openAlertModal,
    closeAlertModal,

    messageModal,
    openMessageModal,
    closeMessageModal,

    openCancelOrderModal,
    openSendMessageModal,
  };
};

export default useUnifiedModal;