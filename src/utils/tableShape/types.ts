import { TableType } from '@/types';

export interface TableReservation {
  time: string;
  bookingNm?: string;
  bookingsNm?: string;
}

export interface TableDimensions {
  width: number;
  height: number;
}

export interface BorderConfig {
  width: number;
  height: number;
  radius: number;
}

export interface BorderPosition {
  key: string;
  className: string;
  left: number;
  top?: number;
}

export const BASE_DIMENSIONS: Record<TableType, TableDimensions> = {
  T4S: { width: 120, height: 120 },
  T6R: { width: 206, height: 120 },
  T8S: { width: 206, height: 206 },
  T8R: { width: 292, height: 120 },
  T10R: { width: 380, height: 120 },
  T12R: { width: 475, height: 120 }
};

export const SIZE_SCALE = 1;
export const CONTENT_PADDING = 24;
