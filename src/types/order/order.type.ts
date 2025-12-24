export type CategoryType = '전체메뉴' | '식사' | '주류' | '안주' | '사이드';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface TableInfo {
  tableNumber: number;
  groupName: string;
  memberNames: string[];
}
