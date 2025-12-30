import {TableType} from "@/types";

export interface TableReservation {
    time: string;
    name: string;
    group?: string;
}

export interface TableData {
    id: string;
    type: TableType;
    position: {
        left: number;
        top: number;
    };
    reservation: TableReservation | null;
    status: 'occupied' | 'empty';
}