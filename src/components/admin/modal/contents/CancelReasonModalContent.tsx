'use client';

import React, { useMemo, useState } from 'react';
import CommonModalLayout from '@/components/admin/modal/CommonModalLayout';
import commonStyles from '@/styles/components/admin/modal/CommonModal.module.scss';
import styles from '@/styles/components/admin/modal/CancelReasonModal.module.scss';
import { useCategoryList } from '@/hooks/api';
import { useToast } from '@/hooks/common/useToast';
import { BillOrder } from '@/types/bill.type';
import { formatPrice } from '@/utils';

interface CancelReasonModalContentProps {
  onConfirm: (payload: { reason: string; orderIdList: number[] }) => void;
  onClose: () => void;
  orderList?: BillOrder[];
  isOrderSelectionRequired?: boolean;
}

const CancelReasonModalContent: React.FC<CancelReasonModalContentProps> = ({
  onConfirm,
  onClose,
  orderList = [],
  isOrderSelectionRequired = false,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const { data: categoryReasons = [] } = useCategoryList('REASON');
  const { showToast } = useToast();

  const formatTime = (value?: string | null): string => {
    if (!value) return '-';
    const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    return value;
  };

  const orderRows = useMemo(() => {
    return orderList.map((order) => {
      const items = order.orderHisList ?? [];
      const firstItem = items[0]?.goodsNm || '-';
      const restCount = items.length > 1 ? items.length - 1 : 0;
      const summary = items.length === 0
        ? '-'
        : restCount > 0
          ? `${firstItem} 외 ${restCount}건`
          : firstItem;

      return {
        orderId: order.orderId,
        time: formatTime(order.createdDt),
        payer: order.playerNm || '-',
        summary,
        amount: formatPrice(order.orderAmt || 0),
      };
    });
  }, [orderList]);

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(selectedReason === reason ? '' : reason);
  };

  const handleOrderToggle = (orderId: number) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      showToast('취소 사유를 선택해주세요.', 'error');
      return;
    }
    if (isOrderSelectionRequired && selectedOrderIds.length === 0) {
      showToast('취소할 주문을 선택해주세요.', 'error');
      return;
    }
    onConfirm({ reason: selectedReason, orderIdList: selectedOrderIds });
  };

  const buttons = (
    <>
      <button
        type="button"
        className={commonStyles.cancelButton}
        onClick={onClose}
      >
        닫기
      </button>
      <button
        type="button"
        className={commonStyles.confirmButton}
        onClick={handleConfirm}
      >
        주문 취소
      </button>
    </>
  );

  return (
    <CommonModalLayout title="주문 취소" buttons={buttons}>
      <div className={styles.cancelContent}>
        {isOrderSelectionRequired && (
          <div className={styles.orderTable}>
            <div className={styles.tableHeader}>
              <div className={`${styles.cell} ${styles.selectColumn}`}>선택</div>
              <div className={`${styles.cell} ${styles.timeColumn}`}>주문시간</div>
              <div className={`${styles.cell} ${styles.payerColumn}`}>결제자명</div>
              <div className={`${styles.cell} ${styles.summaryColumn}`}>주문 내역</div>
              <div className={`${styles.cell} ${styles.amountColumn}`}>총 금액</div>
            </div>
            <div className={styles.tableBody}>
              {orderRows.length === 0 ? (
                <div className={styles.emptyTable}>주문 내역이 없습니다.</div>
              ) : (
                orderRows.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.orderId);
                  return (
                    <button
                      key={order.orderId}
                      type="button"
                      className={`${styles.tableRow} ${isSelected ? styles.selectedRow : ''}`}
                      onClick={() => handleOrderToggle(order.orderId)}
                    >
                      <div className={`${styles.cell} ${styles.selectColumn}`}>
                        <span className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`} />
                      </div>
                      <div className={`${styles.cell} ${styles.timeColumn}`}>
                        <span className={styles.cellText}>{order.time}</span>
                      </div>
                      <div className={`${styles.cell} ${styles.payerColumn}`}>
                        <span className={styles.cellText}>{order.payer}</span>
                      </div>
                      <div className={`${styles.cell} ${styles.summaryColumn}`}>
                        <span className={styles.cellText}>{order.summary}</span>
                      </div>
                      <div className={`${styles.cell} ${styles.amountColumn}`}>
                        <span className={styles.cellText}>{order.amount}원</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
        <div className={`${styles.reasonList} ${categoryReasons.length === 1 ? styles.singleItem : styles.multipleItems}`}>
          {categoryReasons.map((reason) => (
            <button
              key={reason.categoryId}
              className={`${styles.reasonButton} ${
                selectedReason === reason.categoryNm ? styles.selected : ''
              }`}
              onClick={() => handleReasonSelect(reason.categoryNm)}
            >
              {reason.categoryNm}
            </button>
          ))}
        </div>
      </div>
    </CommonModalLayout>
  );
};

export default CancelReasonModalContent;
