'use client';

import React, { useState } from 'react';

import TableSeat from '@/components/order/main/TableSeat';
import styles from '@/styles/pages/order/main.module.scss';
import OrderHeader from "@/components/order/main/Header";
import { seatsMockData } from '@/mock/order/seatMockData';

const OrderMainPage: React.FC = () => {
    const [isTableMode, setIsTableMode] = useState(true);

    const handleModeChange = (tableMode: boolean) => {
        setIsTableMode(tableMode);
    };

    return (
        <div className={styles.mainPage}>
            <OrderHeader
                isTableMode={isTableMode}
                onModeChange={handleModeChange}
                storeName="스타트 하우스"
                currentTime="PM 01:45"
                batteryLevel={50}
            />

            <div className={styles.contentArea}>
                <TableSeat seats={seatsMockData} />
            </div>
        </div>
    );
};

export default OrderMainPage;