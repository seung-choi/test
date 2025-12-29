import { OrderItem, TableInfo } from '@/types/order/order.type';
import { mockMenuItems } from './mockMenuData';

// 테이블 정보 더미 데이터
export const mockTableInfo: TableInfo = {
  tableNumber: 5,
  groupName: '개발팀 회식',
  memberNames: ['홍길동', '김철수', '이영희', '박민수'],
};

// 주문 아이템 더미 데이터
export const mockOrderItems: OrderItem[] = [
  { menuItem: mockMenuItems.find(item => item.id === 'meal-2')!, quantity: 2 },
  { menuItem: mockMenuItems.find(item => item.id === 'drink-3')!, quantity: 3 },
  { menuItem: mockMenuItems.find(item => item.id === 'drink-1')!, quantity: 2 },
  { menuItem: mockMenuItems.find(item => item.id === 'snack-1')!, quantity: 1 },
  { menuItem: mockMenuItems.find(item => item.id === 'snack-3')!, quantity: 1 },
  { menuItem: mockMenuItems.find(item => item.id === 'side-4')!, quantity: 1 },
];
