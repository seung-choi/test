'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';

import TableSeat from '@/components/order/main/TableSeat';
import TableItem from '@/components/order/main/TableItem';
import styles from '@/styles/pages/order/main.module.scss';
import OrderHeader from "@/components/order/main/Header";
import { seatsMockData } from '@/mock/order/seatMockData';
import { useTableList } from '@/hooks/api';
import type { TableData, TableType } from '@/types';

const OrderMainPage: React.FC = () => {
    const [isTableMode, setIsTableMode] = useState(true);
    const { data: tableList = [] } = useTableList();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const handleModeChange = (tableMode: boolean) => {
        setIsTableMode(tableMode);
    };

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const updateSize = () => {
            setContainerSize({
                width: element.clientWidth,
                height: element.clientHeight
            });
        };

        updateSize();

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(() => updateSize());
            observer.observe(element);
            return () => observer.disconnect();
        }

        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const parseXyr = (value: string) => {
        const [x, y, r] = value.split(',').map((item) => Number(item));
        return {
            x: Number.isFinite(x) ? x : 0,
            y: Number.isFinite(y) ? y : 0,
            r: Number.isFinite(r) ? r : 0
        };
    };

    const parseWhp = (value: string) => {
        const [w, h, p] = value.split(',').map((item) => Number(item));
        return {
            w: Number.isFinite(w) ? w : 1920,
            h: Number.isFinite(h) ? h : 1080,
            p: Number.isFinite(p) ? p : 1
        };
    };

    const tableData = useMemo(() => {
        return tableList
            .filter((table) => Boolean(table.tableCd && table.tableXyr))
            .map((table) => {
                const { x, y, r } = parseXyr(table.tableXyr || '0,0,0');
                const { w, h, p } = parseWhp(table.tableWhp || '1920,1080,1');
                if (p !== 1) return null;

                const scaleX = containerSize.width > 0 ? containerSize.width / w : 1;
                const scaleY = containerSize.height > 0 ? containerSize.height / h : 1;
                const scale = Math.min(scaleX, scaleY);

                return {
                    id: table.tableNo,
                    type: table.tableCd as TableType,
                    position: {
                        left: x * scale,
                        top: y * scale
                    },
                    reservation: null,
                    status: 'empty',
                    rotation: r,
                    scale
                } satisfies TableData;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    }, [tableList, containerSize]);

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
                {isTableMode ? (
                    <div className={styles.tableLayoutContainer} ref={containerRef}>
                        {tableData.map((table, index) => (
                            <TableItem key={`${table.id}-${index}`} table={table} />
                        ))}
                    </div>
                ) : (
                    <TableSeat seats={seatsMockData} />
                )}
            </div>
        </div>
    );
};

export default OrderMainPage;
