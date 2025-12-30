export type TableType = '1x1' | '1x2' | '1x3' | '1x4' | '1x5' | '2x1' | '2x2' | '3x1' | '4x1' | '5x1';

export interface PlacedTable {
    id: string;
    type: TableType;
    position: {
        x: number;
        y: number;
    };
    tableNumber?: string;
    rotation?: number;
}

export interface DragData {
    type: TableType;
    isNew: boolean;
    tableId?: string;
}

export interface LayoutPage {
    id: string;
    name: string;
    tables: PlacedTable[];
    gridPosition: { row: number; col: number };
}
