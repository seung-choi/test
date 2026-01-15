import { atom } from 'recoil';
import {
  CancelModalState,
  MessageModalState,
  ConfirmModalState,
  ProductModalState,
  CategoryModalState,
  ErpSearchModalState,
  DeleteConfirmModalState,
  CancelReasonManagementModalState,
  ErpLinkModalState,
} from '@/types';

// 취소 사유 모달
export const cancelModalState = atom<CancelModalState>({
  key: 'cancelModalState',
  default: {
    isShow: false,
    onConfirm: () => {},
    orderList: [],
    isOrderSelectionRequired: false,
  },
});

// 메시지 모달
export const messageModalState = atom<MessageModalState>({
  key: 'messageModalState',
  default: {
    isShow: false,
    title: '',
    bookingId: null,
  },
});

// 확인 모달
export const confirmModalState = atom<ConfirmModalState>({
  key: 'confirmModalState',
  default: {
    isShow: false,
    title: '',
    desc: '',
  },
});

// 상품 등록/수정 모달
export const productModalState = atom<ProductModalState>({
  key: 'productModalState',
  default: {
    isShow: false,
    mode: 'create',
  },
});

// 분류 설정 모달
export const categoryModalState = atom<CategoryModalState>({
  key: 'categoryModalState',
  default: {
    isShow: false,
  },
});

// ERP 검색 모달
export const erpSearchModalState = atom<ErpSearchModalState>({
  key: 'erpSearchModalState',
  default: {
    isShow: false,
  },
});

// 삭제 확인 모달
export const deleteConfirmModalState = atom<DeleteConfirmModalState>({
  key: 'deleteConfirmModalState',
  default: {
    isShow: false,
    items: [],
  },
});

// 취소 사유 관리 모달
export const cancelReasonManagementModalState = atom<CancelReasonManagementModalState>({
  key: 'cancelReasonManagementModalState',
  default: {
    isShow: false,
    reasons: [],
  },
});

// ERP 연동 모달
export const erpLinkModalState = atom<ErpLinkModalState>({
  key: 'erpLinkModalState',
  default: {
    isShow: false,
  },
});
