export type TableType = 'T4S' | 'T6R' | 'T8S' | 'T8R' | 'T10R' | 'T12R';

export interface PlacedTable {
    id: string;
    type: TableType;
    position: {
        x: number;
        y: number;
    };
    tableNumber?: string;
    rotation?: number;
    scale?: number;
    tableId?: number;
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
