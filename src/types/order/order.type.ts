export type CategoryType = string;

export interface MenuOption {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

import { GoodsStatus } from '@/types/goods.type';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  goodsSt: GoodsStatus;
  options?: MenuOption[];
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: { option: MenuOption; quantity: number }[];
}

export interface TableInfo {
  tableNumber: number;
  groupName: string;
  memberNames: string[];
}
