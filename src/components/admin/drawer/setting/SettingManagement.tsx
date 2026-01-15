import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { drawerState } from '@/lib/recoil';
import styles from '@/styles/components/admin/drawer/SalesManagement.module.scss';
import Table from '@/components/admin/common/Table';
import {getSalesTableColumns} from "@/constants";
import SalesFilterActionBar from "@/components/admin/drawer/setting/SalesInquiryActionBar";
import { SalesFilter } from '@/types';
import { exportSalesToExcel } from '@/utils/admin/excel/salesExcelExporter';
import LayoutManager from '@/components/admin/drawer/setting/canvas/LayoutManager';
import { useInfiniteBillList } from '@/hooks/api';
import type { Bill } from '@/types/bill.type';

const formatTime = (value?: string | null) => {
    if (!value) return '-';
    const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
    if (match) {
        return `${match[1]}:${match[2]}`;
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    return value;
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
    const orderList = bill.orderList ?? [];
    const totalMenuCount = orderList.reduce((sum, order) =>
        sum + (order.orderHisList ?? []).reduce((orderSum, item) => orderSum + item.orderCnt, 0), 0
    );

    const orderDetails = orderList
        .flatMap(order => order.orderHisList ?? [])
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

    const cancelReason = orderList
        .filter(order => order.orderRea)
        .map(order => order.orderRea)
        .join(', ') || '-';

    return {
        id: String(bill.billId),
        orderDate: bill.createdDt,
        tO: formatTime(bill.bookingTm),
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
    const contentRef = useRef<HTMLDivElement>(null);
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

    const {
        billList,
        stats,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteBillList({
        fromDate: filter.dateRange.startDate,
        toDate: filter.dateRange.endDate,
    });

    const handleScroll = useCallback(() => {
        if (!contentRef.current || isFetchingNextPage || !hasNextPage) return;

        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollThreshold = 100;

        if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.addEventListener('scroll', handleScroll);
            return () => contentElement.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const handleFilterChange = (newFilter: SalesFilter) => {
        setFilter(newFilter);
    };

    const columns = useMemo(
        () => getSalesTableColumns(),
        []
    );

    const transformedData = useMemo(() => {
        if (!billList || billList.length === 0) return [];
        return billList.map(transformBillToOrderRecord);
    }, [billList]);

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

    const salesStats = useMemo(() => {
        return {
            totalOrders: stats?.totalCnt || 0,
            completedOrders: stats?.doneCnt || 0,
            canceledOrders: stats?.cancelCnt || 0,
            totalAmount: stats?.totalAmt || 0
        };
    }, [stats]);


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
                    stats={salesStats}
                    onExportExcel={handleExportExcel}
                />
            )}

            <div className={styles.contentArea} ref={contentRef}>
                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <p>데이터를 불러오는 중...</p>
                    </div>
                ) : (
                    <>
                        <Table
                            columns={columns}
                            data={filteredData}
                            variant="sales"
                            onSort={() => {}}
                        />
                        {isFetchingNextPage && (
                            <div className={styles.loadingMore}>
                                <p>추가 데이터 로딩 중...</p>
                            </div>
                        )}
                        {!hasNextPage && filteredData.length > 0 && (
                            <div className={styles.endOfList}>
                                <p>모든 데이터를 불러왔습니다.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SettingManagement;