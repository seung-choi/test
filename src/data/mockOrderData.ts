import { OrderItem, TableInfo } from '@/types';
import { mockMenuItems } from './mockMenuData';

export const mockTableInfo: TableInfo = {
  tableNumber: 5,
  groupName: '개발팀 회식',
  memberNames: ['홍길동', '김철수', '이영희', '박민수'],
};

export const mockOrderItems: OrderItem[] = [
  { menuItem: mockMenuItems.find(item => item.id === 'meal-2')!, quantity: 2 },
  { menuItem: mockMenuItems.find(item => item.id === 'drink-3')!, quantity: 3 },
  { menuItem: mockMenuItems.find(item => item.id === 'drink-1')!, quantity: 2 },
  { menuItem: mockMenuItems.find(item => item.id === 'snack-1')!, quantity: 1 },
  { menuItem: mockMenuItems.find(item => item.id === 'snack-3')!, quantity: 1 },
  { menuItem: mockMenuItems.find(item => item.id === 'side-4')!, quantity: 1 },
];

export interface OrderItemDetail {
  orderTime: string;
  payer?: string;
  options?: string;
  memo?: string;
}

export const mockOrderItemDetails: OrderItemDetail[] = [
  { orderTime: '11:45', payer: '김지원', memo: '덜 맵게' },
  { orderTime: '11:45', payer: '김수영' },
  { orderTime: '13:14', payer: '김땡땡' },
  { orderTime: '16:35', payer: '김수영', memo: '치즈 소스 많이' },
  { orderTime: '16:35', payer: '김지원' },
  { orderTime: '16:35', payer: '김수영' },
];
