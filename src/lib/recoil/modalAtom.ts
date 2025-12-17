import { atom } from 'recoil';
import { MessageFormData } from '@/types';

// 취소 사유 모달 (기존 alertModal을 cancelModal로 변경)
export interface CancelModalState {
  isShow: boolean;
  onConfirm: (reason: string) => void;
  onCancel?: () => void;
}

export const cancelModalState = atom<CancelModalState>({
  key: 'cancelModalState',
  default: {
    isShow: false,
    onConfirm: () => {},
  },
});

// 메시지 모달
export interface MessageModalState {
  isShow: boolean;
  title: string;
  recipients?: string[];
  onSubmit?: (data: MessageFormData) => void;
  onCancel?: () => void;
}

export const messageModalState = atom<MessageModalState>({
  key: 'messageModalState',
  default: {
    isShow: false,
    title: '',
  },
});

// 확인 모달 (간단한 확인/취소)
export interface ConfirmModalState {
  isShow: boolean;
  title: string;
  desc: string;
  okBtnLabel?: string;
  cancleBtnLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const confirmModalState = atom<ConfirmModalState>({
  key: 'confirmModalState',
  default: {
    isShow: false,
    title: '',
    desc: '',
  },
});

// 상품 등록/수정 모달
export interface ProductFormData {
  status: '판매' | '대기' | '중지';
  channels: string[];
  types: string[];
  image?: File;
  category: string;
  store: string;
  code: string;
  name: string;
  price: string;
  cookingTime: number;
  tags: string[];
  registeredDate?: string;
  updatedDate?: string;
}

export interface ProductModalState {
  isShow: boolean;
  mode: 'create' | 'edit';
  initialData?: ProductFormData;
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
}

export const productModalState = atom<ProductModalState>({
  key: 'productModalState',
  default: {
    isShow: false,
    mode: 'create',
  },
});