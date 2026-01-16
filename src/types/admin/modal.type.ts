import { MessageFormData, ErpProduct } from '@/types';
import type { GetCategoryResponse } from '@/types/category.type';
import { BillOrder } from '@/types/bill.type';
import type { GoodsChannel, GoodsOption, GoodsStatus } from '@/types/goods.type';

export interface CancelModalState {
  isShow: boolean;
  onConfirm: (payload: { reason: string; orderIdList: number[] }) => void;
  onCancel?: () => void;
  orderList?: BillOrder[];
  isOrderSelectionRequired?: boolean;
}

export interface MessageModalState {
  isShow: boolean;
  title: string;
  recipients?: string[];
  bookingId?: number | null;
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

export interface ErpLinkSelection {
  bookingErp: string;
  playerNm: string;
  playerErp: string;
}

export interface ErpLinkModalState {
  isShow: boolean;
  billId?: number;
  tableId?: number | null;
  onLinkErp?: (selection: ErpLinkSelection) => void;
  onManual?: () => void;
  onCancel?: () => void;
}

export interface CategoryItem extends GetCategoryResponse {
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface SortableCategoryRowProps {
  category: CategoryItem;
  onDelete: (categoryId: number) => void;
}

export interface CancelReasonRow {
  rowId: string;
  categoryId: number | null;
  categoryNm: string;
  categoryOrd: number;
  categoryErp: string;
}

export interface SortableCancelReasonRowProps {
  reason: CancelReasonRow;
  onDelete: (rowId: string) => void;
}
