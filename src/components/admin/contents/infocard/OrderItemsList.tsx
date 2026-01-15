import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { OrderItemSummary, OrderStatus } from '@/types';
import { formatPrice } from '@/utils';

interface OrderItemsListProps {
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  orderItems: OrderItemSummary[];
  orderPlayerName?: string | null;
  orderCourseName?: string | null;
  orderHoleNo?: number | null;
  specialRequest?: string;
  status: OrderStatus;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  totalItems,
  orderTime,
  orderLocation,
  orderItems,
  orderPlayerName,
  orderCourseName,
  orderHoleNo,
  specialRequest,
  status,
}) => {
  const isCompleteStatus = status === 'complete';
  const isCancelStatus = status === 'cancel';
  const isDisabledStatus = isCompleteStatus || isCancelStatus;

  return (
    <div className={styles.currentOrderSection}>
      <div className={styles.orderSummary}>
        <span className={styles.totalItems}>총 {totalItems}개</span>
        <div className={styles.orderInfo}>
          <span className={styles.orderLabel}>주문 정보</span>
          <div className={styles.orderDetails}>
            <span className={styles.orderTimeText}>[{orderPlayerName || '-'}]</span>
            <span className={styles.orderTimeText}>{orderTime}</span>
            <span className={styles.orderLocationText}>
              ({orderCourseName || '-'} {orderHoleNo ?? '-'}H)
            </span>
          </div>
        </div>
      </div>

      <div className={styles.scrollableOrderItems}>
        <div className={styles.orderItems}>
          {orderItems.map((item, index) => (
            <div key={index} className={`${styles.orderItem} ${isDisabledStatus ? styles.disabledOrderItem : ''}`}>
              <div className={styles.itemName}>
                <span>{item.name}</span>
              </div>
              {isCompleteStatus && (
                <div className={styles.itemPrice}>
                  <span>{formatPrice(item.price || 12000)}</span>
                </div>
              )}
              <div className={styles.itemQuantity}>
                <span>{item.quantity}개</span>
              </div>
            </div>
          ))}

          {specialRequest && (
            <div className={`${styles.specialRequest} ${isDisabledStatus ? styles.disabledSpecialRequest : ''}`}>
              <span>[요청] {specialRequest}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;
