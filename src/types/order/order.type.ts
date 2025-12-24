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
  tableNumber: string;
  groupName: string;
  memberNames: string[];
  payerName: string;
}
