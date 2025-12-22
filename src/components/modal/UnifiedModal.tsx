"use client";

import React from 'react';
import useUnifiedModal from '@/hooks/useUnifiedModal';
import alertStyles from '@/styles/components/AlertModal.module.scss';
import CancelReasonModalContent from './contents/CancelReasonModalContent';
import MessageModalContent from './contents/MessageModalContent';
import ConfirmModalContent from './contents/ConfirmModalContent';
import ProductModalContent from './contents/ProductModalContent';
import CategoryModalContent from './contents/CategoryModalContent';
import ErpSearchModalContent from './contents/ErpSearchModalContent';
import DeleteConfirmModalContent from './contents/DeleteConfirmModalContent';
import CancelReasonManagementModalContent from './contents/CancelReasonManagementModalContent';

const UnifiedModal = () => {
  const {
    cancelModal,
    closeCancelModal,
    messageModal,
    closeMessageModal,
    confirmModal,
    closeConfirmModal,
    productModal,
    closeProductModal,
    categoryModal,
    closeCategoryModal,
    erpSearchModal,
    closeErpSearchModal,
    deleteConfirmModal,
    closeDeleteConfirmModal,
    cancelReasonManagementModal,
    closeCancelReasonManagementModal,
  } = useUnifiedModal();

  const handleCancelConfirm = (reason: string) => {
    cancelModal.onConfirm(reason);
    closeCancelModal();
  };

  const handleCancelClose = () => {
    cancelModal.onCancel?.();
    closeCancelModal();
  };

  const handleMessageSubmit = (data: any) => {
    messageModal.onSubmit?.(data);
    closeMessageModal();
  };

  const handleMessageClose = () => {
    messageModal.onCancel?.();
    closeMessageModal();
  };

  const handleConfirmOk = () => {
    confirmModal.onConfirm?.();
    closeConfirmModal();
  };

  const handleConfirmCancel = () => {
    confirmModal.onCancel?.();
    closeConfirmModal();
  };

  const handleProductSubmit = (data: any) => {
    productModal.onSubmit?.(data);
    closeProductModal();
  };

  const handleProductClose = () => {
    productModal.onCancel?.();
    closeProductModal();
  };

  const handleCategorySubmit = (data: any) => {
    categoryModal.onSubmit?.(data);
    closeCategoryModal();
  };

  const handleCategoryClose = () => {
    categoryModal.onCancel?.();
    closeCategoryModal();
  };

  const handleErpProductSelect = (data: any) => {
    erpSearchModal.onSelect?.(data);
    closeErpSearchModal();
  };

  const handleErpSearchClose = () => {
    erpSearchModal.onCancel?.();
    closeErpSearchModal();
  };

  const handleDeleteConfirm = () => {
    deleteConfirmModal.onConfirm?.();
    closeDeleteConfirmModal();
  };

  const handleDeleteClose = () => {
    deleteConfirmModal.onCancel?.();
    closeDeleteConfirmModal();
  };

  const handleCancelReasonManagementSubmit = (data: any) => {
    cancelReasonManagementModal.onSubmit?.(data);
    closeCancelReasonManagementModal();
  };

  const handleCancelReasonManagementClose = () => {
    cancelReasonManagementModal.onCancel?.();
    closeCancelReasonManagementModal();
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>,
    onClose: () => void
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {cancelModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleCancelClose)}
        >
          <CancelReasonModalContent
            onConfirm={handleCancelConfirm}
            onClose={handleCancelClose}
          />
        </div>
      )}

      {messageModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleMessageClose)}
        >
          <MessageModalContent
            title={messageModal.title}
            recipients={messageModal.recipients}
            onSubmit={handleMessageSubmit}
            onClose={handleMessageClose}
          />
        </div>
      )}

      {confirmModal.isShow && (
        <div className={alertStyles["alert-popup"]}>
          <ConfirmModalContent
            title={confirmModal.title}
            desc={confirmModal.desc}
            okBtnLabel={confirmModal.okBtnLabel}
            cancelBtnLabel={confirmModal.cancelBtnLabel}
            onConfirm={handleConfirmOk}
            onCancel={handleConfirmCancel}
          />
        </div>
      )}

      {/* 상품 등록/수정 모달 */}
      {productModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleProductClose)}
        >
          <ProductModalContent
            mode={productModal.mode}
            initialData={productModal.initialData}
            onSubmit={handleProductSubmit}
            onClose={handleProductClose}
          />
        </div>
      )}

      {/* 분류 설정 모달 */}
      {categoryModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleCategoryClose)}
        >
          <CategoryModalContent
            initialCategories={categoryModal.categories}
            onSubmit={handleCategorySubmit}
            onClose={handleCategoryClose}
          />
        </div>
      )}

      {/* ERP 검색 모달 */}
      {erpSearchModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleErpSearchClose)}
        >
          <ErpSearchModalContent
            onSelect={handleErpProductSelect}
            onClose={handleErpSearchClose}
          />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirmModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleDeleteClose)}
        >
          <DeleteConfirmModalContent
            items={deleteConfirmModal.items}
            onConfirm={handleDeleteConfirm}
            onClose={handleDeleteClose}
          />
        </div>
      )}

      {/* 취소 사유 관리 모달 */}
      {cancelReasonManagementModal.isShow && (
        <div
          className={alertStyles["alert-popup"]}
          onClick={(e) => handleOverlayClick(e, handleCancelReasonManagementClose)}
        >
          <CancelReasonManagementModalContent
            initialReasons={cancelReasonManagementModal.reasons}
            onSubmit={handleCancelReasonManagementSubmit}
            onClose={handleCancelReasonManagementClose}
          />
        </div>
      )}
    </>
  );
};

export default UnifiedModal;