import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { OrderStatus } from '@/types';
import { formatPrice } from '@/utils';

interface InfoCardActionsProps {
  status: OrderStatus;
  cancelReason?: string;
  totalAmount?: number;
  onAcceptOrder?: () => void;
  onCancelOrder?: () => void;
  onCompleteOrder?: () => void;
}

const InfoCardActions: React.FC<InfoCardActionsProps> = ({
  status,
  cancelReason,
  totalAmount = 250000,
  onAcceptOrder,
  onCancelOrder,
  onCompleteOrder,
}) => {
  const isCompleteStatus = status === 'complete';

  return (
    <>
      {isCompleteStatus && (
        <div className={styles.totalSection}>
          <div className={styles.totalLabel}>주문 합계</div>
          <div className={styles.totalAmount}>{formatPrice(totalAmount)}원</div>
        </div>
      )}

      <div className={styles.buttonSection}>
        {status === 'order' && (
          <>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancelOrder}
            >
              주문 취소
            </button>
            <button
              className={`${styles.button} ${styles.orderButton}`}
              onClick={onAcceptOrder}
            >
              주문 수락
            </button>
          </>
        )}

        {status === 'accept' && (
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

        {status === 'cancel' && (
          <div className={`${styles.button} ${styles.canceledButton}`}>
            <span>주문 취소 : {cancelReason || '품절'}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default InfoCardActions;
