import { BillOrderStatus, OrderTake } from '@/types/api/bill.type';

export interface OrderItemSummary {
  name: string;
  quantity: number;
  price?: number;
  orderTake?: OrderTake;
}

export interface CustomerInfo {
  name: string;
  group: string;
  time: string;
  members: string[];
}

export interface OrderHistory {
  id: string;
  status: BillOrderStatus;
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
  status: BillOrderStatus;
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
  R: number;
  P: number;
  Y: number;
  N: number;
}
