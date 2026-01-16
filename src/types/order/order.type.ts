export type CategoryType = string;

export interface MenuOption {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
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
