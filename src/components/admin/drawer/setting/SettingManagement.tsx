import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { drawerState } from '@/lib/recoil';
import styles from '@/styles/components/admin/drawer/SalesManagement.module.scss';
import Table from '@/components/admin/common/Table';
import {getSalesTableColumns} from "@/constants";
import SalesFilterActionBar from "@/components/admin/drawer/setting/SalesInquiryActionBar";
import { SalesFilter } from '@/types';
import { exportSalesToExcel } from '@/utils/admin/excel/salesExcelExporter';
import LayoutManager from '@/components/admin/drawer/setting/canvas/LayoutManager';
import { useBillList } from '@/hooks/api';
import { Bill } from '@/types/bill.type';

const formatBookingTime = (bookingTm: { hour: number; minute: number }) => {
    return `${String(bookingTm.hour).padStart(2, '0')}:${String(bookingTm.minute).padStart(2, '0')}`;
};

const getBillStatus = (billSt: string) => {
    switch (billSt) {
        case 'D': return '정산 완료';
        case 'C': return '취소';
        case 'W': return '대기';
        default: return billSt;
    }
};

const transformBillToOrderRecord = (bill: Bill) => {
    const totalMenuCount = bill.orderList.reduce((sum, order) =>
        sum + order.orderHisList.reduce((orderSum, item) => orderSum + item.orderCnt, 0), 0
    );

    const orderDetails = bill.orderList
        .flatMap(order => order.orderHisList)
        .reduce((acc, item) => {
            const existingItem = acc.find(i => i.goodsNm === item.goodsNm);
            if (existingItem) {
                existingItem.count += item.orderCnt;
            } else {
                acc.push({ goodsNm: item.goodsNm, count: item.orderCnt });
            }
            return acc;
        }, [] as { goodsNm: string; count: number }[])
        .map(item => `${item.goodsNm}(${item.count})`)
        .join(', ');

    const cancelReason = bill.orderList
        .filter(order => order.orderRea)
        .map(order => order.orderRea)
        .join(', ') || '-';

    return {
        id: String(bill.billId),
        orderDate: bill.createdDt,
        tO: formatBookingTime(bill.bookingTm),
        caddyName: bill.bookingNm || '-',
        customerNames: bill.playerList || '-',
        groupName: bill.bookingsNm || '-',
        totalMenuCount,
        orderDetails,
        totalAmount: bill.billAmt,
        status: getBillStatus(bill.billSt),
        cancelReason,
    };
};

const SettingManagement = ({showActionBar = true}) => {
    const drawer = useRecoilValue(drawerState);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const [filter, setFilter] = useState<SalesFilter>({
        dateRange: {
            startDate: yesterdayString,
            endDate: yesterdayString
        },
        status: '전체',
        caddyName: '',
        searchTerm: ''
    });

    const { billData, isLoading, refetch } = useBillList({
        fromDt: filter.dateRange.startDate,
        toDt: filter.dateRange.endDate,
        page: 0,
        size: 50
    });

    const handleFilterChange = (newFilter: SalesFilter) => {
        setFilter(newFilter);
    };

    const columns = useMemo(
        () => getSalesTableColumns(),
        []
    );

    const transformedData = useMemo(() => {
        if (!billData?.billList) return [];
        return billData.billList.map(transformBillToOrderRecord);
    }, [billData]);

    const filteredData = useMemo(() => {
        let result = transformedData;

        if (filter.status && filter.status !== '전체') {
            result = result.filter(item => item.status === filter.status);
        }

        if (filter.caddyName) {
            result = result.filter(item =>
                item.caddyName.toLowerCase().includes(filter.caddyName.toLowerCase())
            );
        }

        if (filter.searchTerm) {
            const searchTerm = filter.searchTerm.toLowerCase();
            result = result.filter(item =>
                item.customerNames.toLowerCase().includes(searchTerm) ||
                item.groupName.toLowerCase().includes(searchTerm) ||
                item.orderDetails.toLowerCase().includes(searchTerm) ||
                item.caddyName.toLowerCase().includes(searchTerm)
            );
        }

        return result;
    }, [transformedData, filter.status, filter.caddyName, filter.searchTerm]);

    const stats = useMemo(() => {
        return {
            totalOrders: billData?.totalCnt || 0,
            completedOrders: billData?.doneCnt || 0,
            canceledOrders: billData?.cancelCnt || 0,
            totalAmount: billData?.totalAmt || 0
        };
    }, [billData]);


    const handleExportExcel = () => {
        const orderRecords = filteredData.map(item => ({
            id: item.id,
            orderDate: item.orderDate,
            tO: item.tO,
            caddyName: item.caddyName,
            groupName: item.groupName,
            customerNames: typeof item.customerNames === 'string'
                ? item.customerNames.split(', ')
                : item.customerNames,
            totalMenuCount: item.totalMenuCount,
            orderDetails: item.orderDetails,
            totalAmount: item.totalAmount,
            status: item.status,
            cancelReason: item.cancelReason || ''
        }));

        exportSalesToExcel(orderRecords, filter);
    };

    if (drawer.settingActiveTab === 'layout') {
        return <LayoutManager />;
    }

    return (
        <div className={styles.salesManagement}>
            {showActionBar && (
                <SalesFilterActionBar
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    stats={stats}
                    onExportExcel={handleExportExcel}
                />
            )}

            <div className={styles.contentArea}>
                <Table
                    columns={columns}
                    data={filteredData}
                    variant="sales"
                    onSort={() => {}}
                />
            </div>
        </div>
    );
};

export default SettingManagement;