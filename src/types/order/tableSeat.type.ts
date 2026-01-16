import { TableType } from '@/types';

export interface TableData {
  id: string;
  tableId?: number;
  type: TableType;
  position: {
    left: number;
    top: number;
  };
  rotation?: number;
  scale?: number;
}
