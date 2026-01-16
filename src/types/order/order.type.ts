import type { GetGoodsResponse } from '@/types/goods.type';
import type { GetOrderHisResponse } from '@/types/bill.type';

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

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: { option: MenuOption; quantity: number }[];
}

export interface OrderDetailItem extends GetOrderHisResponse {
  orderTime: string;
  payer?: string;
  memo?: string;
}

export interface TableInfo {
  tableNumber: string;
  groupName: string;
  memberNames: string[];
}
