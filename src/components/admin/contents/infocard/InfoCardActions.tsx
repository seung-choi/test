import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { BillOrderStatus } from '@/types/bill.type';
import { formatPrice } from '@/utils';
import type { InfoCardActionsProps } from '@/types';

const InfoCardActions: React.FC<InfoCardActionsProps> = ({
  status,
  cancelReason,
  totalAmount = 250000,
  selectedTableId,
  onAcceptOrder,
  onCancelOrder,
  onCompleteOrder,
}) => {
  const handleAcceptOrder = () => {
    if (onAcceptOrder) {
      onAcceptOrder(selectedTableId ?? 0);
    }
  };
  const isCompleteStatus = status === 'Y';

  return (
    <>
      {isCompleteStatus && (
        <div className={styles.totalSection}>
          <div className={styles.totalLabel}>주문 합계</div>
          <div className={styles.totalAmount}>{formatPrice(totalAmount)}원</div>
        </div>
      )}

      <div className={styles.buttonSection}>
        {status === 'R' && (
          <>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancelOrder}
            >
              주문 취소
            </button>
            <button
              className={`${styles.button} ${styles.orderButton}`}
              onClick={handleAcceptOrder}
            >
              주문 수락
            </button>
          </>
        )}

        {status === 'P' && (
          <>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancelOrder}
            >
              주문 취소
            </button>
            <button
              className={`${styles.button} ${styles.acceptButton}`}
              onClick={onCompleteOrder}
            >
              정산 완료
            </button>
          </>
        )}

        {isCompleteStatus && (
          <div className={`${styles.button} ${styles.completeButton}`}>
            <span>정산 완료</span>
          </div>
        )}

        {status === 'N' && (
          <div className={`${styles.button} ${styles.canceledButton}`}>
            <span>주문 취소</span>
          </div>
        )}
      </div>
    </>
  );
};

export default InfoCardActions;
