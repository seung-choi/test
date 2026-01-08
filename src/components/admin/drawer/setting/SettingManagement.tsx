import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { drawerState } from '@/lib/recoil';
import styles from '@/styles/components/admin/drawer/SalesManagement.module.scss';
import Table from '@/components/admin/common/Table';
import { SalesMockData } from '@/mock/admin/salesMockData';
import {getSalesTableColumns} from "@/constants";
import SalesFilterActionBar from "@/components/admin/drawer/setting/SalesInquiryActionBar";
import { SalesFilter } from '@/types';
import { exportSalesToExcel } from '@/utils/admin/excel/salesExcelExporter';
import LayoutManager from '@/components/admin/drawer/setting/canvas/LayoutManager';

const SettingManagement = ({showActionBar = true}) => {
    const drawer = useRecoilValue(drawerState);
    const [filter, setFilter] = useState<SalesFilter>({
        dateRange: {
            startDate: '2025-12-22',
            endDate: '2025-12-25'
        },
        status: '전체',
        caddyName: '',
        searchTerm: ''
    });

    const handleFilterChange = (newFilter: SalesFilter) => {
        setFilter(newFilter);
    };

    const columns = useMemo(
        () => getSalesTableColumns(),
        []
    );

    const filteredData = useMemo(() => {
        let result = SalesMockData;

        if (filter.dateRange.startDate && filter.dateRange.endDate) {
            result = result.filter(item => {
                const itemDate = item.orderDate.split('T')[0];
                return itemDate >= filter.dateRange.startDate && itemDate <= filter.dateRange.endDate;
            });
        }

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
    }, [filter]);

    const stats = useMemo(() => {
        const totalOrders = filteredData.length;
        const completedOrders = filteredData.filter(item => item.status === '정산 완료').length;
        const canceledOrders = filteredData.filter(item => item.status === '취소').length;
        const totalAmount = filteredData
            .filter(item => true)
            .reduce((sum, item) => sum + item.totalAmount, 0);

        return {
            totalOrders,
            completedOrders,
            canceledOrders,
            totalAmount
        };
    }, [filteredData]);


    const handleExportExcel = () => {
        const orderRecords = filteredData.map(item => ({
            id: item.id,
            orderDate: item.orderDate,
            tO: item.tO,
            caddyName: item.caddyName,
            groupName: item.groupName,
            customerNames: item.customerNames.split(', '),
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