'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import BaseModal from './BaseModal';
import styles from '@/styles/components/order/modal/OrderDetailModal.module.scss';
import { OrderItem } from '@/types';
import { mockOrderItemDetails } from '@/data/mockOrderData';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onOrderModify: () => void;
}

interface OrderItemWithTime extends OrderItem {
  orderTime: string;
  payer?: string;
  options?: string;
  memo?: string;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  onQuantityChange,
  onOrderModify,
}) => {
  const [selectedTime, setSelectedTime] = useState('전체');
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());
  const initialOrderItemsRef = useRef<OrderItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      initialOrderItemsRef.current = JSON.parse(JSON.stringify(orderItems));
      setDeletedItems(new Set());
    }
  }, [isOpen]);

  const orderItemsWithTime: OrderItemWithTime[] = useMemo(() => {
    return orderItems.map((item, index) => ({
      ...item,
      orderTime: mockOrderItemDetails[index]?.orderTime || '00:00',
      payer: mockOrderItemDetails[index]?.payer,
      options: mockOrderItemDetails[index]?.options,
      memo: mockOrderItemDetails[index]?.memo,
    }));
  }, [orderItems]);

  const hasChanges = useMemo(() => {
    if (deletedItems.size > 0) {
      return true;
    }

    if (initialOrderItemsRef.current.length !== orderItems.length) {
      return true;
    }

    return orderItems.some((item, index) => {
      const initialItem = initialOrderItemsRef.current[index];
      return !initialItem ||
             item.menuItem.id !== initialItem.menuItem.id ||
             item.quantity !== initialItem.quantity;
    });
  }, [orderItems, deletedItems]);

  const handleDelete = (itemId: string) => {
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
    const groups: Record<string, OrderItemWithTime[]> = {};
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

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const footer = (
    <>
      <button
        className={styles.modifyButton}
        onClick={onOrderModify}
        disabled={!hasChanges}
      >
        주문 수정
      </button>
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
                const isDeleted = deletedItems.has(item.menuItem.id);
                const deletedStyle = isDeleted ? {
                  color: '#6600FF',
                  fontWeight: '600',
                  textDecoration: 'line-through'
                } : {};

                return (
                  <tr
                    key={index}
                    className={`${index > 0 && filteredItems[index - 1].orderTime !== item.orderTime ? styles.borderTop : ''}`}
                  >
                    <td className={styles.columnCheck}>
                      <img
                        src='/assets/image/global/x/x-sm.svg'
                        alt="삭제"
                        onClick={() => handleDelete(item.menuItem.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td className={styles.columnTime} style={deletedStyle}>{item.orderTime}</td>
                    <td className={styles.columnMenu} style={deletedStyle}>{item.menuItem.name}</td>
                    <td className={styles.columnMemo}>
                      {item.memo && <span className={styles.memoText} style={deletedStyle}>{item.memo}</span>}
                    </td>
                    <td className={styles.columnPayer} style={deletedStyle}>
                      {item.payer || '-'}
                    </td>
                    <td className={styles.columnQuantity}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => onQuantityChange(item.menuItem.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isDeleted}
                        >
                          -
                        </button>
                        <div className={styles.quantityDisplay} style={deletedStyle}>{item.quantity}</div>
                        <button
                          onClick={() => onQuantityChange(item.menuItem.id, item.quantity + 1)}
                          disabled={isDeleted}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className={styles.columnPrice} style={deletedStyle}>
                      {(item.menuItem.price * item.quantity).toLocaleString('ko-KR')} 원
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
