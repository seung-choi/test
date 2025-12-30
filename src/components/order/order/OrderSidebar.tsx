'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/order/order/OrderSidebar.module.scss';
import {OrderItem, TableInfo} from '@/types';

interface OrderSidebarProps {
    tableInfo: TableInfo;
    orderItems: OrderItem[];
    onMemoClick: () => void;
    onOrderClick: () => void;
    onDetailClick: () => void;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
    selectedPayer?: string;
    onPayerSelect?: (payerName: string) => void;
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({
                                                       tableInfo,
                                                       orderItems,
                                                       onMemoClick,
                                                       onOrderClick,
                                                       onDetailClick,
                                                       onQuantityChange,
                                                       selectedPayer,
                                                       onPayerSelect,
                                                   }) => {
    const [isPayerDropdownOpen, setIsPayerDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPayerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePayerBadgeClick = () => {
        setIsPayerDropdownOpen(!isPayerDropdownOpen);
    };

    const handlePayerSelect = (payerName: string) => {
        onPayerSelect?.(payerName);
        setIsPayerDropdownOpen(false);
    };

    const displayedPayer = selectedPayer;

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
                        <div className={styles.payerSection} ref={dropdownRef}>
                            <button
                                className={`${styles.payerBadge} ${isPayerDropdownOpen ? styles.active : ''}`}
                                onClick={handlePayerBadgeClick}
                            >
                                <span>{displayedPayer || '결제자'}</span>
                                <div className={`${styles.arrowDown} ${isPayerDropdownOpen ? styles.rotated : ''}`}/>
                            </button>
                            
                            {isPayerDropdownOpen && (
                                <div className={styles.payerDropdown}>
                                    {tableInfo.memberNames.map((memberName, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.payerOption} ${selectedPayer === memberName ? styles.selected : ''}`}
                                            onClick={() => handlePayerSelect(memberName)}
                                        >
                                            {memberName}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                                <div className={styles.itemContent}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => onQuantityChange(item.menuItem.id, 0)}
                                        aria-label="삭제"
                                    >
                                        <img src="/assets/image/global/x/x-sm.svg" alt="삭제" />
                                    </button>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemHeader}>
                                            <div className={styles.itemName}>{item.menuItem.name}</div>
                                            <div className={styles.itemPrice}>
                                                {(item.menuItem.price * item.quantity).toLocaleString('ko-KR')}원
                                            </div>
                                        </div>
                                        <div className={styles.quantityControl}>
                                            <div className={styles.quantityDisplay}>{item.quantity}</div>
                                            <div className={styles.quantityButton}>
                                                <button
                                                    onClick={() => onQuantityChange(item.menuItem.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => onQuantityChange(item.menuItem.id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                        </div>
                                    </div>
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