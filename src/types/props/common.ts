import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import type { TableType } from '@/types/admin/layout.type';
import type { TableReservation } from '@/utils/tableShape/types';

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export interface TableShapeProps {
  type: TableType;
  scale?: number;
  borderColor?: string;
  rotation?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  variant?: 'order' | 'admin';
  reservation?: TableReservation;
  status?: 'empty' | 'occupied';
  tableNumber?: string;
  tableId?: string;
}

export type ErpToastVariant = 'success' | 'empty' | 'error';

export interface ErpToastProps {
  message: string;
  variant?: ErpToastVariant;
}

export interface TableCardProps {
  id: string;
  time?: string;
  customerName?: string;
  groupName?: string;
  members?: string[];
  tableNumber: string;
  isEmpty: boolean;
  onClick?: () => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  label: string;
  size?: 'small' | 'medium' | 'large';
  primary?: boolean;
  disabled?: boolean;
  readonly?: string;
  id?: string;
  block?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
}
