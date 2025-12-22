import { useRecoilState } from 'recoil';
import { MessageFormData } from '@/types';
import {
  cancelModalState,
  messageModalState,
  confirmModalState,
  productModalState,
  categoryModalState,
  erpSearchModalState,
  deleteConfirmModalState,
  cancelReasonManagementModalState,
  ProductFormData,
  Category,
  DeleteItem,
  CancelReason
} from '@/lib/recoil/modalAtom';
import { ErpProduct } from '@/types/erp';

const useUnifiedModal = () => {
  const [cancelModal, setCancelModal] = useRecoilState(cancelModalState);
  const [messageModal, setMessageModal] = useRecoilState(messageModalState);
  const [confirmModal, setConfirmModal] = useRecoilState(confirmModalState);
  const [productModal, setProductModal] = useRecoilState(productModalState);
  const [categoryModal, setCategoryModal] = useRecoilState(categoryModalState);
  const [erpSearchModal, setErpSearchModal] = useRecoilState(erpSearchModalState);
  const [deleteConfirmModal, setDeleteConfirmModal] = useRecoilState(deleteConfirmModalState);
  const [cancelReasonManagementModal, setCancelReasonManagementModal] = useRecoilState(cancelReasonManagementModalState);

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

  const openSendMessageModal = (
    recipients: string[],
    onSend: (data: MessageFormData) => void,
    onCancel?: () => void
  ) => {
    openMessageModal('메시지 보내기', recipients, onSend, onCancel);
  };

  const openCancelOrderModal = (
    onConfirm: (reason: string) => void,
    onCancel?: () => void
  ) => {
    openCancelModal(onConfirm, onCancel);
  };

  const openConfirmModal = (
    title: string,
    desc: string,
    onConfirm: () => void,
    onCancel?: () => void,
    okBtnLabel?: string,
    cancelBtnLabel?: string
  ) => {
    setConfirmModal({
      isShow: true,
      title,
      desc,
      onConfirm,
      onCancel,
      okBtnLabel,
      cancelBtnLabel,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

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

  // 삭제 확인 모달
  const openDeleteConfirmModal = (
    items: DeleteItem[],
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setDeleteConfirmModal({
      isShow: true,
      items,
      onConfirm,
      onCancel,
    });
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmModal(prev => ({
      ...prev,
      isShow: false,
    }));
  };

  // 취소 사유 관리 모달
  const openCancelReasonManagementModal = (
    reasons: CancelReason[],
    onSubmit: (reasons: CancelReason[]) => void,
    onCancel?: () => void
  ) => {
    setCancelReasonManagementModal({
      isShow: true,
      reasons,
      onSubmit,
      onCancel,
    });
  };

  const closeCancelReasonManagementModal = () => {
    setCancelReasonManagementModal(prev => ({
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

    // 삭제 확인 모달
    deleteConfirmModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,

    // 취소 사유 관리 모달
    cancelReasonManagementModal,
    openCancelReasonManagementModal,
    closeCancelReasonManagementModal,
  };
};

export default useUnifiedModal;