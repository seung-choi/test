"use client";

import React from 'react';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import ModalWrapper from './ModalWrapper';
import { createModalHandlers } from '@/utils/admin/modalHelpers';
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

  const messageHandlers = createModalHandlers({
    onSubmit: messageModal.onSubmit,
    onCancel: messageModal.onCancel,
    closeModal: closeMessageModal,
  });

  const confirmHandlers = createModalHandlers({
    onConfirm: confirmModal.onConfirm,
    onCancel: confirmModal.onCancel,
    closeModal: closeConfirmModal,
  });

  const productHandlers = createModalHandlers({
    onSubmit: productModal.onSubmit,
    onCancel: productModal.onCancel,
    closeModal: closeProductModal,
  });

  const categoryHandlers = createModalHandlers({
    onSubmit: categoryModal.onSubmit,
    onCancel: categoryModal.onCancel,
    closeModal: closeCategoryModal,
  });

  const erpSearchHandlers = createModalHandlers({
    onSelect: erpSearchModal.onSelect,
    onCancel: erpSearchModal.onCancel,
    closeModal: closeErpSearchModal,
  });

  const deleteConfirmHandlers = createModalHandlers({
    onConfirm: deleteConfirmModal.onConfirm,
    onCancel: deleteConfirmModal.onCancel,
    closeModal: closeDeleteConfirmModal,
  });

  const cancelReasonManagementHandlers = createModalHandlers({
    onSubmit: cancelReasonManagementModal.onSubmit,
    onCancel: cancelReasonManagementModal.onCancel,
    closeModal: closeCancelReasonManagementModal,
  });

  return (
    <>
      <ModalWrapper isShow={cancelModal.isShow} onClose={handleCancelClose}>
        <CancelReasonModalContent
          onConfirm={handleCancelConfirm}
          onClose={handleCancelClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={messageModal.isShow} onClose={messageHandlers.handleClose}>
        <MessageModalContent
          title={messageModal.title}
          recipients={messageModal.recipients}
          onSubmit={messageHandlers.handleSubmit}
          onClose={messageHandlers.handleClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={confirmModal.isShow} onClose={confirmHandlers.handleClose} enableOverlayClick={false}>
        <ConfirmModalContent
          title={confirmModal.title}
          desc={confirmModal.desc}
          okBtnLabel={confirmModal.okBtnLabel}
          cancelBtnLabel={confirmModal.cancelBtnLabel}
          onConfirm={confirmHandlers.handleConfirm}
          onCancel={confirmHandlers.handleClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={productModal.isShow} onClose={productHandlers.handleClose}>
        <ProductModalContent
          mode={productModal.mode}
          initialData={productModal.initialData}
          onSubmit={productHandlers.handleSubmit}
          onClose={productHandlers.handleClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={categoryModal.isShow} onClose={categoryHandlers.handleClose}>
        <CategoryModalContent
          initialCategories={categoryModal.categories}
          onSubmit={categoryHandlers.handleSubmit}
          onClose={categoryHandlers.handleClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={erpSearchModal.isShow} onClose={erpSearchHandlers.handleClose}>
        <ErpSearchModalContent
          onSelect={erpSearchHandlers.handleSelect}
          onClose={erpSearchHandlers.handleClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={deleteConfirmModal.isShow} onClose={deleteConfirmHandlers.handleClose}>
        <DeleteConfirmModalContent
          items={deleteConfirmModal.items}
          onConfirm={deleteConfirmHandlers.handleConfirm}
          onClose={deleteConfirmHandlers.handleClose}
        />
      </ModalWrapper>

      <ModalWrapper isShow={cancelReasonManagementModal.isShow} onClose={cancelReasonManagementHandlers.handleClose}>
        <CancelReasonManagementModalContent
          initialReasons={cancelReasonManagementModal.reasons}
          onSubmit={cancelReasonManagementHandlers.handleSubmit}
          onClose={cancelReasonManagementHandlers.handleClose}
        />
      </ModalWrapper>
    </>
  );
};

export default UnifiedModal;
