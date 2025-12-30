import { MessageFormData, ErpProduct } from '@/types';

export interface CancelModalState {
  isShow: boolean;
  onConfirm: (reason: string) => void;
  onCancel?: () => void;
}

export interface MessageModalState {
  isShow: boolean;
  title: string;
  recipients?: string[];
  onSubmit?: (data: MessageFormData) => void;
  onCancel?: () => void;
}

export interface ConfirmModalState {
  isShow: boolean;
  title: string;
  desc: string;
  okBtnLabel?: string;
  cancelBtnLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

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

export interface ErpSearchModalState {
  isShow: boolean;
  onSelect?: (product: ErpProduct) => void;
  onCancel?: () => void;
}

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
