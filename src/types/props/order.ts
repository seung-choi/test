import type { ReactNode } from 'react';
import type { CategoryType, MenuItem, MenuOption, OrderItem, TableInfo } from '@/types/order/order.type';
import type { TableData } from '@/types/order/tableSeat.type';

export interface OrderHeaderProps {
  isTableMode: boolean;
  onModeChange: (isTableMode: boolean) => void;
  storeName?: string;
  currentTime?: string;
  batteryLevel?: number;
}

export interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  minQuantity?: number;
  className?: string;
  variant?: 'default' | 'modal' | 'sidebar';
}

export type OrderHeaderVariant = 'main' | 'assign';

export interface OrderHeaderShellProps {
  variant?: OrderHeaderVariant;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export interface TableItemProps {
  table: TableData;
}

export interface SeatData {
  id: string;
  tableId?: number;
  billId?: number;
  time: string;
  customerName?: string;
  groupName?: string;
  members?: string[];
  tableNumber: string;
  isEmpty: boolean;
}

export interface TableSeatProps {
  seats: SeatData[];
}

export interface MenuGridProps {
  items: MenuItem[];
  categories: string[];
  onMenuClick: (item: MenuItem) => void;
}

export interface CategoryTabsProps {
  categories: CategoryType[];
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export interface OrderSidebarProps {
  tableInfo: TableInfo;
  orderItems: OrderItem[];
  onMemoClick: () => void;
  onOrderClick: () => void;
  onDetailClick: () => void;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  selectedPayer?: string;
  onPayerSelect?: (payerName: string) => void;
  hidePayerSection?: boolean;
  hideMemberNames?: boolean;
}

export interface ManualRegisterModalProps {
  isOpen: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  hasError?: boolean;
}

export interface MenuOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onAddToOrder: (menuItem: MenuItem, selectedOptions: { option: MenuOption; quantity: number }[]) => void;
}

export interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  billId?: number | null;
}

export interface MemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memo: string) => void;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}
