'use client';

import React, { useMemo } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableNumberList.module.scss';
import { useTableErpList, useTableList } from '@/hooks/api';
import { useQueryClient } from '@tanstack/react-query';

const TableNumberList: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: tableList = [] } = useTableList();
    const { refetch: refetchErpList, isFetching } = useTableErpList({ enabled: false });

    const tableNumbers = useMemo(
        () =>
            [...tableList]
                .sort((a, b) => a.tableOrd - b.tableOrd)
                .map((table) => table.tableNo),
        [tableList]
    );

    const handleErpSync = async () => {
        const result = await refetchErpList();
        if (result.data) {
            queryClient.setQueryData(['tableList'], result.data);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>테이블 번호</h2>
                <button
                    className={styles.erpButton}
                    onClick={handleErpSync}
                    disabled={isFetching}
                >
                    ERP 연동
                </button>
            </div>
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {tableNumbers.map((number, index) => (
                        <div key={index} className={styles.listItem}>
                            {number.endsWith('번') ? number : `${number}번`}
                        </div>
                    ))}
                </div>
            </div>
            <button className={styles.addButton}>
                <img src="/assets/image/admin/setting/add.svg" alt="add" />
                <span>직접 추가</span>
            </button>
        </div>
    );
};

export default TableNumberList;
