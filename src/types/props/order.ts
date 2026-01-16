import type { ReactNode } from 'react';
import type { CategoryType, MenuItem, MenuItemWithOptions, MenuOption, OrderItem, TableInfo } from '@/types/order/order.type';
import type { TableData } from '@/types/order/tableSeat.type';
import type { Bill } from '@/types/api/bill.type';
import type { GetTableResponse } from '@/types/api/table.type';

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
  bill?: Bill;
}

export interface TableSeatProps {
  tables: GetTableResponse[];
  billsByTableId: Map<number, Bill>;
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
  onQuantityChange: (itemId: number, newQuantity: number) => void;
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
  menuItem: MenuItemWithOptions | null;
  onAddToOrder: (menuItem: MenuItemWithOptions, selectedOptions: { option: MenuOption; quantity: number }[]) => void;
}

export interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onQuantityChange: (itemId: number, newQuantity: number) => void;
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
