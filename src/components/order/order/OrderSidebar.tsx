'use client';

import React from 'react';
import styles from '@/styles/components/order/order/OrderSidebar.module.scss';
import { OrderItem, TableInfo } from '@/types/order/order.type';

interface OrderSidebarProps {
  tableInfo: TableInfo;
  orderItems: OrderItem[];
  onMemoClick: () => void;
  onOrderClick: () => void;
  onDetailClick: () => void;
}

/**
 * 주문 사이드바 컴포넌트
 */
const OrderSidebar: React.FC<OrderSidebarProps> = ({
  tableInfo,
  orderItems,
  onMemoClick,
  onOrderClick,
  onDetailClick,
}) => {
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <div className={styles.sidebar}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.title}>주문</div>
        <button className={styles.detailButton} onClick={onDetailClick}>
          상세 내역
        </button>
      </div>

      {/* 테이블 정보 */}
      <div className={styles.tableInfo}>
        <div className={styles.tableNumber}>
          테이블 번호 : {tableInfo.tableNumber}
        </div>
      </div>

      {/* 주문자 정보 */}
      <div className={styles.orderInfo}>
        <div className={styles.groupHeader}>
          <div className={styles.groupName}>{tableInfo.groupName}</div>
          <div className={styles.payerBadge}>
            <span>결제자</span>
            <div className={styles.arrowDown} />
          </div>
        </div>
        <div className={styles.memberNames}>
          {tableInfo.memberNames.join(', ')}
        </div>
      </div>

      {/* 주문 개수 */}
      <div className={styles.orderCount}>총 {totalItems}개</div>

      {/* 주문 리스트 */}
      <div className={styles.orderList}>
        {orderItems.length === 0 ? (
          <div className={styles.emptyMessage}>주문 내역이 없습니다.</div>
        ) : (
          orderItems.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <div className={styles.itemName}>{item.menuItem.name}</div>
              <div className={styles.itemInfo}>
                <span className={styles.itemQuantity}>x{item.quantity}</span>
                <span className={styles.itemPrice}>
                  ₩{(item.menuItem.price * item.quantity).toLocaleString('ko-KR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 그라디언트 */}
      <div className={styles.bottomGradient} />

      {/* 액션 버튼 */}
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
