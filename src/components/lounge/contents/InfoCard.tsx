'use client'

import React, { useState } from 'react';
import styles from '../../../styles/components/lounge/contents/InfoCard.module.scss';
import { CustomerInfo, OrderItem, OrderHistory, OrderStatus } from '@/types';
import { getTagAltText, getTagImage } from '@/utils/tagUtils';

export interface InfoCardProps {
  tableNumber: string;
  customerInfo: CustomerInfo;
  orderItems?: OrderItem[];
  orderHistory?: OrderHistory[];
  specialRequest?: string;
  totalItems: number;
  orderTime: string;
  orderLocation: string;
  status?: OrderStatus;
  cancelReason?: string;
  tags?: string[];
  totalAmount?: number;
  onAcceptOrder?: () => void;
  onCancelOrder?: () => void;
  onCompleteOrder?: () => void;
  onMessageOrder?: () => void;
  onTableSelect?: (tableNumber: string) => void;
  availableTables?: string[];
}

const InfoCard: React.FC<InfoCardProps> = ({
                                             tableNumber,
                                             customerInfo,
                                             orderItems = [],
                                             orderHistory = [],
                                             specialRequest,
                                             totalItems,
                                             orderTime,
                                             orderLocation,
                                             status = 'order',
                                             cancelReason,
                                             tags = [],
                                             totalAmount = 250000,
                                             onAcceptOrder,
                                             onCancelOrder,
                                             onCompleteOrder,
                                             onMessageOrder,
                                             onTableSelect,
                                             availableTables = [],
                                           }) => {
  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Set<string>>(new Set());
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const toggleHistoryExpansion = (historyId: string) => {
    const newExpanded = new Set(expandedHistoryIds);
    if (newExpanded.has(historyId)) {
      newExpanded.delete(historyId);
    } else {
      newExpanded.add(historyId);
    }
    setExpandedHistoryIds(newExpanded);
  };

  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
    setIsTableDropdownOpen(false);
    if (onTableSelect) {
      onTableSelect(table);
    }
  };

  const toggleTableDropdown = () => {
    setIsTableDropdownOpen(!isTableDropdownOpen);
  };

  const isOrderCard = status === 'order';
  const isCompleteStatus = status === 'complete';
  const isCancelStatus = status === 'cancel';
  const isDisabledStatus = isCompleteStatus || isCancelStatus;
  const hasOrderHistory = orderHistory && orderHistory.length > 0;

  const borderColor = isOrderCard ? '#9081D8' : '#D9D9D9';
  const hasShadow = isOrderCard;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const getTableTagStyles = () => {
    if (isDisabledStatus) {
      return {
        background: '#D9D9D9',
        border: 'none',
        color: '#666',
      };
    } else if (selectedTable){
      return {
        background: '#E6E9F1',
        border: 'none',
        color: '#313246'
      }
    } else {
      return {
        background: 'rgba(219.94, 0, 0, 0.10)',
        border: '1px solid #DC0000',
        color: '#DC0000'
      };
    }
  };

  const getArrowIcon = () => {
    if (selectedTable || isDisabledStatus) {
      return <img src={'/assets/image/info-card/arrow-dark.svg'} alt="arrow" />;
    }
    return <img src={'/assets/image/info-card/arrow-red.svg'} alt="arrow" />
  };


  return (
    <div
      className={`${styles.infoCard} ${isOrderCard ? styles.historyCard : styles.newCard} ${isDisabledStatus ? styles.disabledCard : ''}`}
      style={{
        border: `2px solid ${borderColor}`,
        boxShadow: hasShadow ? '0px 0px 10px rgba(144, 129, 216, 0.50)' : 'none'
      }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.tableSelectContainer}>
            <div
              className={`${styles.tableTag} ${styles.clickableTableTag}`}
              style={getTableTagStyles()}
              onClick={toggleTableDropdown}
            >
              <span className={`${styles.tableText} ${selectedTable}`}>
                {tableNumber || (selectedTable || '테이블')}
              </span>
              {getArrowIcon()}
            </div>
            {isTableDropdownOpen && !isDisabledStatus && (
              <div className={styles.tableDropdown}>
                {availableTables.map((table, index) => (
                  <div
                    key={index}
                    className={`${styles.tableOption} ${selectedTable === table ? styles.selectedOption : ''}`}
                    onClick={() => handleTableSelect(table)}
                  >
                    {table}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.tableInfo}>
              <img src="/assets/image/info-card/location.svg" alt="위치" />
              <span className={styles.tableNumber}>{orderLocation}</span>
            </div>
        </div>

        <div className={styles.customerSection}>
          <div className={styles.customerHeader}>
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <div key={index} className={`${styles.tag} ${styles[`${tag}Tag`] || styles.defaultTag}`}>
                  <img src={getTagImage(tag)} alt={getTagAltText(tag)} />
                </div>
              ))}
            </div>
            <div className={styles.customerInfo}>
              <div className={styles.customerMain}>
                <span className={styles.customerName}>
                  {customerInfo.name}({customerInfo.group})
                </span>
                <span className={styles.customerTime}>{customerInfo.time}</span>
              </div>
              <div onClick={onMessageOrder}>
                <img src="/assets/image/info-card/meassage.svg" alt="메시지" />
              </div>
            </div>
          </div>
          <div className={styles.membersList}>
            {customerInfo.members.join(' ')}
          </div>
        </div>

        <div className={styles.currentOrderSection}>
          <div className={styles.orderSummary}>
            <span className={styles.totalItems}>총 {totalItems}개</span>
            <div className={styles.orderInfo}>
              <span className={styles.orderLabel}>주문 정보</span>
              <div className={styles.orderDetails}>
                <span className={styles.orderTimeText}>{orderTime}</span>
                <span className={styles.orderLocationText}>({orderLocation})</span>
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

          {isOrderCard && hasOrderHistory && (
            <div className={styles.orderHistorySection}>
              {orderHistory.map((history) => (
                <div
                  key={history.id}
                  className={styles.historyItem}
                  onClick={() => toggleHistoryExpansion(history.id)}
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
                        src="/assets/image/global/arrow.svg"
                        alt="펼치기"
                        className={`${styles.expandArrow} ${expandedHistoryIds.has(history.id) ? styles.expanded : ''}`}
                      />
                    </div>
                  </div>

                  {expandedHistoryIds.has(history.id) && (
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
          )}

          {isCompleteStatus && (
            <div className={styles.totalSection}>
              <div className={styles.totalLabel}>주문 합계</div>
              <div className={styles.totalAmount}>{formatPrice(totalAmount)}원</div>
            </div>
          )}

        </div>
      </div>

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
    </div>
  );
};

export default InfoCard;