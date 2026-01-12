import { MessageFormData, ErpProduct } from '@/types';
import type { GoodsChannel, GoodsOption, GoodsStatus } from '@/api/goods';

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
  goodsId?: number;
  categoryId?: number;
  categoryNm: string;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm: number;
  goodsImg?: File | string;
  goodsOrd?: number;
  goodsTag?: string;
  goodsSt: GoodsStatus;
  goodsErp?: string;
  createdDt?: string;
  modifiedDt?: string;
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
  categoryId: number | null;
  categoryNm: string;
  categoryOrd: number;
  categoryErp?: string;
}

export interface CancelReasonManagementModalState {
  isShow: boolean;
  reasons?: CancelReason[];
  onSubmit?: (reasons: CancelReason[]) => void;
  onCancel?: () => void;
}
