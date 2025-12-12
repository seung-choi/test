import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styles from '@/styles/components/admin/lounge/drawer/SalesManagement.module.scss';
import Table from '@/components/common/Table';
import { SalesMockData } from '@/mock/salesMockData';
import { drawerState } from '@/lib/recoil';
import {getSalesTableColumns} from "@/constants/columns/SalesTable";
import SalesFilterActionBar from "@/components/admin/setting/SalesInquiryActionBar";
import { SalesFilter } from '@/types/admin/setting.types';

interface SettingManagementProps {
    onClose: () => void;
}

const SettingManagement: React.FC<SettingManagementProps> = ({ onClose }) => {
    const drawer = useRecoilValue(drawerState);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
                const itemDate = item.orderDate;
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
            .filter(item => item.totalAmount !== '-')
            .reduce((sum, item) => sum + parseInt(item.totalAmount.replace(',', '')), 0);

        return {
            totalOrders,
            completedOrders,
            canceledOrders,
            totalAmount
        };
    }, [filteredData]);

    const handleExportExcel = () => {
        console.log('엑셀 내보내기:', filteredData);
    };

    return (
        <div className={styles.salesManagement}>
            <SalesFilterActionBar
                filter={filter}
                onFilterChange={handleFilterChange}
                stats={stats}
                onExportExcel={handleExportExcel}
            />

            <div className={styles.contentArea}>
                <div className={styles.itemCount}>총 {filteredData.length}개</div>

                <Table
                    columns={columns}
                    data={filteredData}
                    variant="sales"
                    onSort={(key) => console.log('정렬:', key)}
                />
            </div>

            <div className={styles.scrollbar} />
        </div>
    );
};

export default SettingManagement;