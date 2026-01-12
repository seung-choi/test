import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { OrderHistory } from '@/types';

interface OrderHistorySectionProps {
  orderHistory: OrderHistory[];
  isExpanded: (historyId: string) => boolean;
  onToggleExpansion: (historyId: string) => void;
}

const OrderHistorySection: React.FC<OrderHistorySectionProps> = ({
  orderHistory,
  isExpanded,
  onToggleExpansion,
}) => {
  if (!orderHistory || orderHistory.length === 0) {
    return null;
  }

  return (
    <div className={styles.orderHistorySection}>
      {orderHistory.map((history) => (
        <div
          key={history.id}
          className={styles.historyItem}
          onClick={() => onToggleExpansion(history.id)}
        >
          <div className={styles.historySummary}>
            <span className={styles.historyStatus}>
              {history.status === 'accept' ? '수락' : '완료'} (총 {history.totalItems}개)
            </span>
            <div className={styles.historyInfo}>
              <span className={styles.orderLabel}>주문 정보</span>
              <div className={styles.orderDetails}>
                <span className={styles.orderTimeText}>{history.orderTime}</span>
                <span className={styles.orderLocationText}>({history.orderLocation})</span>
              </div>
              <img
                src="/assets/image/global/arrow/arrow.svg"
                alt="펼치기"
                className={`${styles.expandArrow} ${isExpanded(history.id) ? styles.expanded : ''}`}
              />
            </div>
          </div>

          {isExpanded(history.id) && (
            <div className={styles.historyDetails}>
              {history.items.map((item, index) => (
                <div key={index} className={styles.historyOrderItem}>
                  <div>
                    <span className={styles.itemName}>{item.name}</span>
                  </div>
                  <div>
                    <span className={styles.itemQuantity}>{item.quantity}개</span>
                  </div>
                </div>
              ))}
              {history.specialRequest && (
                <div className={styles.historySpecialRequest}>
                  <span>[요청] {history.specialRequest}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistorySection;
