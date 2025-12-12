// 설정 탭 타입
export type SettingTab = 'sales' | 'layout';

// 매출 조회 필터 타입
export interface SalesFilter {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: string;
  caddyName: string;
  searchTerm: string;
}

// 매출 통계 타입
export interface SalesStats {
  totalOrders: number;
  completedOrders: number;
  canceledOrders: number;
  totalAmount: number;
}

// 주문 내역 타입
export interface OrderRecord {
  id: string;
  orderDate: string;
  teeOff: string;
  caddyName: string;
  customers: string[];
  groupName: string;
  totalItems: number;
  menuDetails: string;
  totalAmount: number;
  status: '정산 완료' | '취소';
  cancelReason?: string;
}
