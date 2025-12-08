export interface OrderItem {
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
  status: 'accepted' | 'completed';
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  items: OrderItem[];
  specialRequest?: string;
  isExpanded?: boolean;
}

export type InfoCardStatus = 'order' | 'accept' | 'complete' | 'cancel';
export type CardType = 'new' | 'history';
export type TableType = 'table' | 'room';

export interface InfoCardData {
  id: string;
  status: InfoCardStatus;
  cardType: CardType;
  tableType: TableType;
  tableNumber: string;
  customerInfo: CustomerInfo;
  orderItems: OrderItem[];
  orderHistory?: OrderHistory[];
  specialRequest?: string;
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  isVip: boolean;
  hasTeamTag: boolean;
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

export interface InfoCardProps {
  cardType?: CardType;
  tableType: TableType;
  tableNumber: string;
  customerInfo: CustomerInfo;
  orderItems?: OrderItem[];
  orderHistory?: OrderHistory[];
  specialRequest?: string;
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  isVip?: boolean;
  hasTeamTag?: boolean;
  status?: InfoCardStatus;
  cancelReason?: string;
  totalAmount?: number;
  onAcceptOrder?: () => void;
  onCancelOrder?: () => void;
  onCompleteOrder?: () => void;
}