'use client';

import React from 'react';
import styles from '@/styles/components/order/order/OrderSidebar.module.scss';
import {OrderItem, TableInfo} from '@/types/order/order.type';

interface OrderSidebarProps {
    tableInfo: TableInfo;
    orderItems: OrderItem[];
    onMemoClick: () => void;
    onOrderClick: () => void;
    onDetailClick: () => void;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({
                                                       tableInfo,
                                                       orderItems,
                                                       onMemoClick,
                                                       onOrderClick,
                                                       onDetailClick,
                                                       onQuantityChange,
                                                   }) => {
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
    );

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.title}>주문</div>
                <button className={styles.detailButton} onClick={onDetailClick}>
                    상세 내역
                </button>
            </div>

            <div className={styles.orderSummary}>
                <div className={styles.tableInfo}>
                    <div className={styles.tableNumber}>
                        테이블 번호 : {tableInfo.tableNumber}
                    </div>
                </div>

                <div className={styles.orderInfo}>
                    <div className={styles.groupHeader}>
                        <div className={styles.groupName}>{tableInfo.groupName}</div>
                        <div className={styles.payerBadge}>
                            <span>결제자</span>
                            <div className={styles.arrowDown}/>
                        </div>
                    </div>
                    <div className={styles.memberNames}>
                        {tableInfo.memberNames.join(', ')}
                    </div>
                </div>

                <div className={styles.orderCount}>총 {totalItems}개</div>

                <div className={styles.orderList}>
                    {orderItems.length === 0 ? (
                        <div className={styles.emptyMessage}>주문 내역이 없습니다.</div>
                    ) : (
                        orderItems.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <div className={styles.itemHeader}>
                                    <div className={styles.itemName}>{item.menuItem.name}</div>
                                    <div className={styles.itemPrice}>
                                        {(item.menuItem.price * item.quantity).toLocaleString('ko-KR')}원
                                    </div>
                                </div>
                                <div className={styles.quantityControl}>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => onQuantityChange(item.menuItem.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <div className={styles.quantityDisplay}>{item.quantity}</div>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => onQuantityChange(item.menuItem.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={styles.totalSection}>
                <div className={styles.totalLabel}>총 합계</div>
                <div className={styles.totalAmount}>
                    {totalAmount.toLocaleString('ko-KR')}원
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.memoButton} onClick={onMemoClick}>
                    메모
                </button>
                <button className={styles.orderButton} onClick={onOrderClick}>
                    주문하기
                </button>
            </div>
        </div>
    );
};

export default OrderSidebar;
