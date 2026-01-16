'use client';

import React, { useState, useMemo } from 'react';
import BaseModal from './BaseModal';
import styles from '@/styles/components/order/modal/OrderDetailModal.module.scss';
import { OrderDetailItem } from '@/types';
import QuantityControl from '@/components/order/common/QuantityControl';
import type { OrderDetailModalProps } from '@/types';
import { useBillOrderList, useDeleteBillOrderList } from '@/hooks/api';
import { formatTime } from '@/utils';

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  onQuantityChange,
  billId,
}) => {
  const [selectedTime, setSelectedTime] = useState('전체');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { orderList = [] } = useBillOrderList(billId ?? 0, {
    enabled: isOpen && Boolean(billId),
  });
  const { mutateAsync: deleteBillOrderList, isPending: isCanceling } = useDeleteBillOrderList();
  const isHistoryView = orderList.length > 0;

  const orderItemsWithTime: OrderDetailItem[] = useMemo(() => {
    if (orderList.length === 0) {
      return orderItems.map((item, index) => ({
        orderNo: item.goodsId,
        goodsId: item.goodsId,
        goodsNm: item.goods.goodsNm,
        orderOrd: index + 1,
        orderCnt: item.orderCnt,
        orderAmt: item.orderAmt,
        orderTake: item.orderTake ?? 'N',
        createdDt: '',
        modifiedDt: '',
        orderTime: '00:00',
      }));
    }

    return orderList.flatMap((order) =>
      (order.orderHisList ?? []).map((item) => ({
        ...item,
        orderTime: formatTime(order.createdDt),
        payer: order.playerNm || undefined,
        memo: order.orderReq || undefined,
        orderSt: order.orderSt,
        orderId: order.orderId,
      }))
    );
  }, [orderItems, orderList]);

  const groupedByTime = useMemo(() => {
    const groups: Record<string, OrderDetailItem[]> = {};
    orderItemsWithTime.forEach((item) => {
      if (!groups[item.orderTime]) {
        groups[item.orderTime] = [];
      }
      groups[item.orderTime].push(item);
    });
    return groups;
  }, [orderItemsWithTime]);

  const timeSlotStatus = useMemo(() => {
    const statusMap: Record<string, { isCanceled: boolean; hasCancelable: boolean }> = {};
    Object.entries(groupedByTime).forEach(([time, items]) => {
      if (items.length === 0) return;
      const isCanceled = items.every((item) => item.orderSt === 'N');
      const hasCancelable = items.some((item) => item.orderSt !== 'N');
      statusMap[time] = { isCanceled, hasCancelable };
    });
    return statusMap;
  }, [groupedByTime]);

  const isFilteredTab = selectedTime !== '전체';
  const selectedTabStatus = isFilteredTab ? timeSlotStatus[selectedTime] : undefined;
  const hasCancelableOrders = Boolean(selectedTabStatus?.hasCancelable);

  const handleCancelConfirm = async () => {
    if (!billId || orderList.length === 0 || !isFilteredTab) {
      setIsCancelModalOpen(false);
      return;
    }

    const orderIdList = orderList
      .filter((order) => formatTime(order.createdDt) === selectedTime)
      .filter((order) => order.orderSt !== 'N')
      .map((order) => order.orderId);

    if (orderIdList.length === 0) {
      setIsCancelModalOpen(false);
      return;
    }

    await deleteBillOrderList({
      billId,
      data: {
        orderIdList,
      },
    });
    setIsCancelModalOpen(false);
  };

  const timeSlots = Object.keys(groupedByTime).sort();

  const filteredItems =
    selectedTime === '전체'
      ? orderItemsWithTime
      : groupedByTime[selectedTime] || [];

  const totalItems = orderItemsWithTime.reduce((sum, item) => sum + item.orderCnt, 0);
  const totalAmount = orderItemsWithTime.reduce(
    (sum, item) => sum + item.orderAmt * item.orderCnt,
    0
  );

  const footer = (
    <>
      {isHistoryView && isFilteredTab ? (
        <button
          className={`${styles.cancelButton} ${!hasCancelableOrders ? styles.cancelComplete : ''}`}
          onClick={() => setIsCancelModalOpen(true)}
          disabled={!hasCancelableOrders || isCanceling}
        >
          {hasCancelableOrders ? '주문 취소' : '취소 완료'}
        </button>
      ) : (
        <div />
      )}
      <div className={styles.totalInfo}>
        <span className={styles.totalCount}>총 {totalItems}개</span>
        <span className={styles.totalAmount}>
          {totalAmount.toLocaleString('ko-KR')} 원
        </span>
      </div>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="주문 내역"
      footer={footer}
    >
      <div className={styles.detailContent}>
        <div className={styles.timeTabs}>
          <button
            className={`${styles.timeTab} ${selectedTime === '전체' ? styles.active : ''}`}
            onClick={() => setSelectedTime('전체')}
          >
            전체
          </button>
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`${styles.timeTab} ${selectedTime === time ? styles.active : ''} ${timeSlotStatus[time]?.isCanceled ? styles.canceledTab : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time} (주문 {groupedByTime[time].length}건)
            </button>
          ))}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th className={styles.columnTime}>시간</th>
                <th className={styles.columnMenu}>메뉴</th>
                <th className={styles.columnMemo}>메모</th>
                <th className={styles.columnPayer}>결제자</th>
                <th className={styles.columnQuantity}>수량</th>
                <th className={styles.columnPrice}>금액</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const rowKey = isHistoryView ? item.orderNo : item.goodsId;
                const isCanceled = item.orderSt === 'N';
                const deletedStyle = isCanceled ? {
                  color: '#666666',
                  fontWeight: '600',
                  textDecoration: 'line-through'
                } : {};

                return (
                  <tr
                    key={rowKey}
                    className={`${index > 0 && filteredItems[index - 1].orderTime !== item.orderTime ? styles.borderTop : ''}`}
                  >
                    <td className={styles.columnTime} style={deletedStyle}>{item.orderTime}</td>
                    <td className={styles.columnMenu} style={deletedStyle}>{item.goodsNm}</td>
                    <td className={styles.columnMemo}>
                      {item.memo && <span className={styles.memoText} style={deletedStyle}>{item.memo}</span>}
                    </td>
                    <td className={styles.columnPayer} style={deletedStyle}>
                      {item.payer || '-'}
                    </td>
                    <td className={styles.columnQuantity}>
                      {isHistoryView ? (
                        <span className={styles.quantityText} style={deletedStyle}>
                          {item.orderCnt}
                        </span>
                      ) : (
                        <QuantityControl
                          quantity={item.orderCnt}
                          onIncrease={() => {
                            if (!isHistoryView) {
                              onQuantityChange(item.goodsId, item.orderCnt + 1);
                            }
                          }}
                          onDecrease={() => {
                            if (!isHistoryView) {
                              onQuantityChange(item.goodsId, item.orderCnt - 1);
                            }
                          }}
                          disabled={isCanceled || isHistoryView}
                          variant="default"
                        />
                      )}
                    </td>
                    <td className={styles.columnPrice} style={deletedStyle}>
                      {(item.orderAmt * item.orderCnt).toLocaleString('ko-KR')} 원
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isCancelModalOpen && (
        <div className={styles.cancelOverlay}>
          <div className={styles.cancelModal}>
            <div className={styles.cancelHeader}>주문 취소</div>
            <div className={styles.cancelMessage}>주문을 취소 하시겠습니까?</div>
            <div className={styles.cancelActions}>
              <button
                className={styles.cancelCloseButton}
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCanceling}
              >
                닫기
              </button>
              <button
                className={styles.cancelConfirmButton}
                onClick={handleCancelConfirm}
                disabled={!hasCancelableOrders || isCanceling}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default OrderDetailModal;
