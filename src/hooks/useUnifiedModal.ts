import { useRecoilState } from 'recoil';
import { MessageFormData } from '@/types';
import {
  cancelModalState,
  messageModalState,
  confirmModalState,
  productModalState,
  categoryModalState,
  erpSearchModalState,
  ProductFormData,
  Category
} from '@/lib/recoil/modalAtom';
import { ErpProduct } from '@/types/erp';

const useUnifiedModal = () => {
  const [cancelModal, setCancelModal] = useRecoilState(cancelModalState);
  const [messageModal, setMessageModal] = useRecoilState(messageModalState);
  const [confirmModal, setConfirmModal] = useRecoilState(confirmModalState);
  const [productModal, setProductModal] = useRecoilState(productModalState);
  const [categoryModal, setCategoryModal] = useRecoilState(categoryModalState);
  const [erpSearchModal, setErpSearchModal] = useRecoilState(erpSearchModalState);

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

  // 상품 등록/수정 모달
  const openProductModal = (
    mode: 'create' | 'edit',
    onSubmit: (data: ProductFormData) => void,
    initialData?: ProductFormData,
    onCancel?: () => void
  ) => {
    setProductModal({
      isShow: true,
      mode,
      initialData,
      onSubmit,
      onCancel,
    });
  };

  const closeProductModal = () => {
    setProductModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  // 편의 함수: 상품 등록 모달
  const openCreateProductModal = (
    onSubmit: (data: ProductFormData) => void,
    initialData?: ProductFormData,
    onCancel?: () => void
  ) => {
    openProductModal('create', onSubmit, initialData, onCancel);
  };

  // 편의 함수: 상품 수정 모달
  const openEditProductModal = (
    initialData: ProductFormData,
    onSubmit: (data: ProductFormData) => void,
    onCancel?: () => void
  ) => {
    openProductModal('edit', onSubmit, initialData, onCancel);
  };

  // 분류 설정 모달
  const openCategoryModal = (
    categories: Category[],
    onSubmit: (categories: Category[]) => void,
    onCancel?: () => void
  ) => {
    setCategoryModal({
      isShow: true,
      categories,
      onSubmit,
      onCancel,
    });
  };

  const closeCategoryModal = () => {
    setCategoryModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  // ERP 검색 모달
  const openErpSearchModal = (
    onSelect: (product: ErpProduct) => void,
    onCancel?: () => void
  ) => {
    setErpSearchModal({
      isShow: true,
      onSelect,
      onCancel,
    });
  };

  const closeErpSearchModal = () => {
    setErpSearchModal(prev => ({
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

    // 상품 모달
    productModal,
    openProductModal,
    closeProductModal,
    openCreateProductModal,
    openEditProductModal,

    // 분류 설정 모달
    categoryModal,
    openCategoryModal,
    closeCategoryModal,

    // ERP 검색 모달
    erpSearchModal,
    openErpSearchModal,
    closeErpSearchModal,
  };
};

export default useUnifiedModal;