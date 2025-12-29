export interface TableReservation {
    time: string;
    name: string;
    group?: string;
}

export interface TableData {
    id: string;
    type: '1x1' | '1x2' | '1x3' | '1x4' | '1x5' | '2x1' | '2x2' | '3x1' | '4x1' | '5x1';
    position: {
        left: number;
        top: number;
    };
    reservation: TableReservation | null;
    status: 'occupied' | 'empty';
}