import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { OrderHistory } from '@/types';
import { BillOrderStatus } from '@/types/bill.type';

interface OrderHistorySectionProps {
  orderHistory: OrderHistory[];
  isExpanded: (historyId: string) => boolean;
  onToggleExpansion: (historyId: string) => void;
}

const getStatusLabel = (status: BillOrderStatus, cancelReason?: string): string => {
  switch (status) {
    case 'P':
      return '수락';
    case 'Y':
      return '완료';
    case 'N':
      return `주문 취소${cancelReason ? ` (${cancelReason})` : ''}`;
    default:
      return '';
  }
};

const OrderHistorySection: React.FC<OrderHistorySectionProps> = ({
  orderHistory,
  isExpanded,
  onToggleExpansion,
}) => {
  const filteredHistory = orderHistory.filter((history) => history.status !== 'R');

  if (!filteredHistory || filteredHistory.length === 0) {
    return null;
  }

  return (
    <div className={styles.orderHistorySection}>
      {filteredHistory.map((history) => {
        const isCanceled = history.status === 'N';

        return (
          <div
            key={history.id}
            className={`${styles.historyItem} ${isCanceled ? styles.canceledHistoryItem : ''}`}
            onClick={() => onToggleExpansion(history.id)}
          >
            <div className={`${styles.historySummary} ${isCanceled ? styles.canceledSummary : ''}`}>
              <span className={`${styles.historyStatus} ${isCanceled ? styles.canceledStatus : ''}`}>
                {getStatusLabel(history.status, history.cancelReason)}
                {!isCanceled && ` (총 ${history.totalItems}개)`}
              </span>
              <div className={styles.historyInfo}>
                {history.playerName && (
                  <span className={styles.orderPlayerName}>[{history.playerName}]</span>
                )}
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
              <div className={`${styles.historyDetails} ${isCanceled ? styles.canceledDetails : ''}`}>
                {history.items.map((item, index) => (
                  <div key={index} className={`${styles.historyOrderItem} ${isCanceled ? styles.canceledOrderItem : ''}`}>
                    <div>
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                    <div>
                      <span className={styles.itemQuantity}>{item.quantity}개</span>
                    </div>
                  </div>
                ))}
                {history.specialRequest && (
                  <div className={`${styles.historySpecialRequest} ${isCanceled ? styles.canceledSpecialRequest : ''}`}>
                    <span>[요청] {history.specialRequest}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistorySection;
