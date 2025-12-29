'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableNumberList.module.scss';

const tableNumbers = [
    '1번', '2번', '3번', '4번', '5번', '6번', '7번',
    '7-1번', '7-2번', '8번', '9번', '10번', '11번', '12번', '13번', '14번'
];

const TableNumberList: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>테이블 번호</h2>
                <button className={styles.erpButton}>ERP 연동</button>
            </div>
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {tableNumbers.map((number, index) => (
                        <div key={index} className={styles.listItem}>
                            {number}
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
