import { atom } from 'recoil';
import { MessageFormData } from '@/types';
import { ErpProduct } from '@/types/erp';

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

export interface ConfirmModalState {
  isShow: boolean;
  title: string;
  desc: string;
  okBtnLabel?: string;
  cancelBtnLabel?: string;
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

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface CategoryModalState {
  isShow: boolean;
  categories: Category[];
  onSubmit?: (categories: Category[]) => void;
  onCancel?: () => void;
}

export const categoryModalState = atom<CategoryModalState>({
  key: 'categoryModalState',
  default: {
    isShow: false,
    categories: [],
  },
});

export interface ErpSearchModalState {
  isShow: boolean;
  onSelect?: (product: ErpProduct) => void;
  onCancel?: () => void;
}

export const erpSearchModalState = atom<ErpSearchModalState>({
  key: 'erpSearchModalState',
  default: {
    isShow: false,
  },
});

export interface DeleteItem {
  code: string;
  category: string;
  name: string;
  price: number;
}

export interface DeleteConfirmModalState {
  isShow: boolean;
  items: DeleteItem[];
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const deleteConfirmModalState = atom<DeleteConfirmModalState>({
  key: 'deleteConfirmModalState',
  default: {
    isShow: false,
    items: [],
  },
});

export interface CancelReason {
  id: string;
  content: string;
  order: number;
}

export interface CancelReasonManagementModalState {
  isShow: boolean;
  reasons: CancelReason[];
  onSubmit?: (reasons: CancelReason[]) => void;
  onCancel?: () => void;
}

export const cancelReasonManagementModalState = atom<CancelReasonManagementModalState>({
  key: 'cancelReasonManagementModalState',
  default: {
    isShow: false,
    reasons: [],
  },
});