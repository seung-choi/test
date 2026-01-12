import { TableData } from '@/types';

export const tablesMockData: TableData[] = [
    {
        id: 'T1',
        type: 'T4S',
        position: { left: 0, top: 10 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T2',
        type: 'T4S',
        position: { left: 184, top: 12 },
        reservation: {
            time: '13:45',
            name: '박예은',
            group: '행복회 3기'
        },
        status: 'occupied'
    },
    {
        id: 'T3',
        type: 'T4S',
        position: { left: 368, top: 10 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T4',
        type: 'T4S',
        position: { left: 552, top: 10 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T5',
        type: 'T4S',
        position: { left: 736, top: 12 },
        reservation: {
            time: '12:56',
            name: '유시원'
        },
        status: 'occupied'
    },
    {
        id: 'T6',
        type: 'T6R',
        position: { left: 93, top: 455 },
        reservation: {
            time: '12:34',
            name: '양정원',
            group: '엔진 2기'
        },
        status: 'occupied'
    },
    {
        id: 'T6',
        type: 'T12R',
        position: { left: 461, top: 460 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T7',
        type: 'T8S',
        position: { left: 277, top: 195 },
        reservation: {
            time: '13:00',
            name: '김지원',
            group: '행복회 4기'
        },
        status: 'occupied'
    },
    {
        id: 'T7',
        type: 'T6R',
        position: { left: 645, top: 193 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T10',
        type: 'T4S',
        position: { left: 920, top: 132 },
        reservation: {
            time: '13:10',
            name: '김채원'
        },
        status: 'occupied'
    },
    {
        id: 'T11',
        type: 'T8R',
        position: { left: 1104, top: 32 },
        reservation: {
            time: '11:40',
            name: '유민지'
        },
        status: 'occupied'
    },
    {
        id: 'T12',
        type: 'T4S',
        position: { left: 920, top: 316 },
        reservation: {
            time: '14:00',
            name: '정수빈'
        },
        status: 'occupied'
    },
    {
        id: 'T13',
        type: 'T4S',
        position: { left: 1104, top: 315 },
        reservation: {
            time: '11:30',
            name: '이영애'
        },
        status: 'occupied'
    },
    {
        id: 'T14',
        type: 'T4S',
        position: { left: 1288, top: 315 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T15',
        type: 'T8R',
        position: { left: 1496, top: 17 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T16',
        type: 'T10R',
        position: { left: 1664, top: 17 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T17',
        type: 'T6R',
        position: { left: 1857, top: 0 },
        reservation: {
            time: '13:00',
            name: '김지원',
            group: '행복회 4기'
        },
        status: 'occupied'
    },
    {
        id: 'T19',
        type: 'T10R',
        position: { left: 1857, top: 233 },
        reservation: null,
        status: 'empty'
    },
    {
        id: 'T18',
        type: 'T10R',
        position: { left: 1345, top: 493 },
        reservation: {
            time: '13:00',
            name: '김지원',
            group: '행복회 4기'
        },
        status: 'occupied'
    }
];
