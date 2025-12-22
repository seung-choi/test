import {OrderStatus} from "@/types";

export type SettingTab = 'sales' | 'layout';

export interface SalesFilter {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: string;
  caddyName: string;
  searchTerm: string;
}

export interface SalesStats {
  totalOrders: number;
  completedOrders: number;
  canceledOrders: number;
  totalAmount: number;
}

export interface OrderRecord {
  id: string;
  orderDate: string;
  tO: string;
  caddyName: string;
  customerNames: string[];
  groupName: string;
  totalMenuCount: string;
  orderDetails: string;
  totalAmount: number;
  status: string;
  cancelReason?: string;
}
