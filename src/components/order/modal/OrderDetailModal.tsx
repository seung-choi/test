'use client';

import React, { useState, useMemo, useEffect } from 'react';
import BaseModal from './BaseModal';
import styles from '@/styles/components/order/modal/OrderDetailModal.module.scss';
import { OrderDetailItem } from '@/types';
import QuantityControl from '@/components/order/common/QuantityControl';
import type { OrderDetailModalProps } from '@/types';
import { useBillOrderList } from '@/hooks/api';
import { formatTime } from '@/utils';

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  onQuantityChange,
  billId,
}) => {
  const [selectedTime, setSelectedTime] = useState('전체');
  const [deletedItems, setDeletedItems] = useState<Set<number>>(new Set());
  const { orderList = [] } = useBillOrderList(billId ?? 0, {
    enabled: isOpen && Boolean(billId),
  });
  const isHistoryView = orderList.length > 0;

  useEffect(() => {
    if (isOpen) {
      setDeletedItems(new Set());
    }
  }, [isOpen]);

  const orderItemsWithTime: OrderDetailItem[] = useMemo(() => {
    if (orderList.length === 0) {
      return orderItems.map((item, index) => ({
        orderNo: item.menuItem.goodsId,
        goodsId: item.menuItem.goodsId,
        goodsNm: item.menuItem.goodsNm,
        orderOrd: index + 1,
        orderCnt: item.quantity,
        orderAmt: item.menuItem.goodsAmt,
        orderTake: 'N',
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
      }))
    );
  }, [orderItems, orderList]);

  const handleDelete = (itemId: number) => {
    setDeletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

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
      <div/>
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
              className={`${styles.timeTab} ${selectedTime === time ? styles.active : ''}`}
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
                <th className={styles.columnCheck}></th>
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
                const isDeleted = deletedItems.has(rowKey);
                const deletedStyle = isDeleted ? {
                  color: '#6600FF',
                  fontWeight: '600',
                  textDecoration: 'line-through'
                } : {};

                return (
                  <tr
                    key={rowKey}
                    className={`${index > 0 && filteredItems[index - 1].orderTime !== item.orderTime ? styles.borderTop : ''}`}
                  >
                    <td className={styles.columnCheck}>
                      <img
                        src='/assets/image/global/x/x-sm.svg'
                        alt="삭제"
                        onClick={() => handleDelete(rowKey)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td className={styles.columnTime} style={deletedStyle}>{item.orderTime}</td>
                    <td className={styles.columnMenu} style={deletedStyle}>{item.goodsNm}</td>
                    <td className={styles.columnMemo}>
                      {item.memo && <span className={styles.memoText} style={deletedStyle}>{item.memo}</span>}
                    </td>
                    <td className={styles.columnPayer} style={deletedStyle}>
                      {item.payer || '-'}
                    </td>
                    <td className={styles.columnQuantity}>
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
                        disabled={isDeleted || isHistoryView}
                        variant="default"
                      />
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
    </BaseModal>
  );
};

export default OrderDetailModal;
