export type OrderStatus = 'order' | 'accept' | 'complete' | 'cancel';

export interface OrderItemSummary {
  name: string;
  quantity: number;
  price?: number;
}

export interface CustomerInfo {
  name: string;
  group: string;
  time: string;
  members: string[];
}

export interface OrderHistory {
  id: string;
  status: OrderStatus;
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  items: OrderItemSummary[];
  specialRequest?: string;
  isExpanded?: boolean;
  cancelReason?: string;
  playerName?: string;
}

export interface InfoCardData {
  id: string;
  status: OrderStatus;
  tableNumber: string;
  customerInfo: CustomerInfo;
  orderItems?: OrderItemSummary[];
  orderHistory?: OrderHistory[];
  specialRequest?: string;
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  tags?: string[];
  cancelReason?: string;
  totalAmount?: number;
}

export interface OrderCounts {
  all: number;
  order: number;
  accept: number;
  complete: number;
  cancel: number;
}