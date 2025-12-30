'use client';

import { exportToExcel } from './excelExport';
import { OrderRecord, SalesFilter } from '@/types';

export const exportSalesToExcel = async (
    records: OrderRecord[],
    filter: SalesFilter
) => {
    const filteredData = records.filter(record => {
        const recordDate = new Date(record.orderDate);
        const startDate = new Date(filter.dateRange.startDate);
        const endDate = new Date(filter.dateRange.endDate);

        return !(recordDate < startDate || recordDate > endDate);
    });

    const columns = [
        { key: 'orderDate' as keyof OrderRecord, header: '주문 일자', width: 15 },
        { key: 'tO' as keyof OrderRecord, header: '티오프', width: 15 },
        { key: 'caddyName' as keyof OrderRecord, header: '캐디명', width: 12 },
        { key: 'customerNames' as keyof OrderRecord, header: '내장객(단체명)', width: 20 },
        { key: 'totalMenuCount' as keyof OrderRecord, header: '주문 상품 수', width: 15},
        { key: 'orderDetails' as keyof OrderRecord, header: '주문 메뉴 내역', width: 30 },
        { key: 'totalAmount' as keyof OrderRecord, header: '총 주문금액', width: 15 },
        { key: 'status' as keyof OrderRecord, header: '최종 상태', width: 12 },
        { key: 'cancelReason' as keyof OrderRecord, header: '취소 사유', width: 15}
    ];

    const exportData = filteredData.map(record => ({
        ...record,
        customerNames: Array.isArray(record.customerNames) 
            ? record.customerNames.join(', ') 
            : record.customerNames,
        cancelReason: record.cancelReason || ''
    }));

    const filename = `서서울CC_매출조회_${filter.dateRange.startDate}~${filter.dateRange.endDate}.xlsx`;

    await exportToExcel(exportData, columns, {
        filename,
        sheetName: '매출 조회',
        title: `서서울CC 매출조회 (${filter.dateRange.startDate} ~ ${filter.dateRange.endDate})`,
        titleCell: 'B2',
        titleMergeTo: 'J2',
    });
};