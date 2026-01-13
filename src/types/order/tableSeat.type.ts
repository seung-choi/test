import { TableType } from '@/types';
import { TableReservation } from '@/utils/tableShape/types';

export type { TableReservation };

export interface TableData {
  id: string;
  type: TableType;
  position: {
    left: number;
    top: number;
  };
  reservation: TableReservation | null;
  status: 'occupied' | 'empty';
  rotation?: number;
  scale?: number;
}
