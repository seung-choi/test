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
} from '@/lib/recoil/admin/modalAtom';
import {
  ProductFormData,
  Category,
  DeleteItem,
  CancelReason,
  ErpProduct
} from '@/types';

// 공통 close 함수 생성 헬퍼
const createCloseModal = <T extends { isShow: boolean }>(
  setState: (updater: (prev: T) => T) => void
) => {
  return () => setState(prev => ({ ...prev, isShow: false }));
};

const useUnifiedModal = () => {
  const [cancelModal, setCancelModal] = useRecoilState(cancelModalState);
  const [messageModal, setMessageModal] = useRecoilState(messageModalState);
  const [confirmModal, setConfirmModal] = useRecoilState(confirmModalState);
  const [productModal, setProductModal] = useRecoilState(productModalState);
  const [categoryModal, setCategoryModal] = useRecoilState(categoryModalState);
  const [erpSearchModal, setErpSearchModal] = useRecoilState(erpSearchModalState);
  const [deleteConfirmModal, setDeleteConfirmModal] = useRecoilState(deleteConfirmModalState);
  const [cancelReasonManagementModal, setCancelReasonManagementModal] = useRecoilState(cancelReasonManagementModalState);

  // Close 함수들
  const closeCancelModal = createCloseModal(setCancelModal);
  const closeMessageModal = createCloseModal(setMessageModal);
  const closeConfirmModal = createCloseModal(setConfirmModal);
  const closeProductModal = createCloseModal(setProductModal);
  const closeCategoryModal = createCloseModal(setCategoryModal);
  const closeErpSearchModal = createCloseModal(setErpSearchModal);
  const closeDeleteConfirmModal = createCloseModal(setDeleteConfirmModal);
  const closeCancelReasonManagementModal = createCloseModal(setCancelReasonManagementModal);

  // 취소 사유 모달
  const openCancelModal = (onConfirm: (reason: string) => void, onCancel?: () => void) => {
    setCancelModal({
      isShow: true,
      onConfirm,
      onCancel,
    });
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

  // 확인 모달
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

  const openCreateProductModal = (
    onSubmit: (data: ProductFormData) => void,
    initialData?: ProductFormData,
    onCancel?: () => void
  ) => {
    openProductModal('create', onSubmit, initialData, onCancel);
  };

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
