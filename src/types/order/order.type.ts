import type { GetGoodsResponse } from '@/types/api/goods.type';
import type { BillOrderStatus, GetOrderHisResponse, OrderHisRequest } from '@/types/api/bill.type';

export type CategoryType = string;

export interface MenuOption {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export type MenuItem = GetGoodsResponse;

export interface MenuItemWithOptions extends MenuItem {
  options?: MenuOption[];
}

export interface OrderItem extends OrderHisRequest {
  goods: GetGoodsResponse;
  selectedOptions?: { option: MenuOption; quantity: number }[];
}

export interface OrderDetailItem extends GetOrderHisResponse {
  orderTime: string;
  payer?: string;
  memo?: string;
  orderSt?: BillOrderStatus;
  orderId?: number;
}

export interface TableInfo {
  tableNumber: string;
  bookingNm: string;
  bookingsNm: string;
  playerList: string[];
}
