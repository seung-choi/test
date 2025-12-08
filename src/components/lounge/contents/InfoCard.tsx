'use client'

import React, { useState } from 'react';
import styles from '../../../styles/components/lounge/contents/InfoCard.module.scss';
import { InfoCardProps } from '@/types/orderInfoType';

const InfoCard: React.FC<InfoCardProps> = ({
                                             cardType = 'new',
                                             tableType,
                                             tableNumber,
                                             customerInfo,
                                             orderItems = [],
                                             orderHistory = [],
                                             specialRequest,
                                             totalItems,
                                             orderTime,
                                             orderLocation,
                                             isVip = false,
                                             hasTeamTag = false,
                                             status = 'order',
                                             cancelReason,
                                             totalAmount = 250000,
                                             onAcceptOrder,
                                             onCancelOrder,
                                             onCompleteOrder,
                                           }) => {
  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Set<string>>(new Set());

  const toggleHistoryExpansion = (historyId: string) => {
    const newExpanded = new Set(expandedHistoryIds);
    if (newExpanded.has(historyId)) {
      newExpanded.delete(historyId);
    } else {
      newExpanded.add(historyId);
    }
    setExpandedHistoryIds(newExpanded);
  };

  const isHistoryCard = cardType === 'history';
  const isCompleteStatus = status === 'complete';
  const isCancelStatus = status === 'cancel';
  const isDisabledStatus = isCompleteStatus || isCancelStatus;

  const borderColor = isHistoryCard ? '#D9D9D9' : '#9081D8';
  const hasShadow = !isHistoryCard;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div
      className={`${styles.infoCard} ${isHistoryCard ? styles.historyCard : styles.newCard} ${isDisabledStatus ? styles.disabledCard : ''}`}
      style={{
        border: `2px solid ${borderColor}`,
        boxShadow: hasShadow ? '0px 0px 10px rgba(144, 129, 216, 0.50)' : 'none'
      }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={`${styles.tableTag} ${isHistoryCard || isDisabledStatus ? styles.disabledTableTag : ''}`}>
            <span className={styles.tableText}>
              {isHistoryCard ? tableNumber : (tableType === 'table' ? '테이블' : '룸')}
            </span>
            <img src={'/assets/image/info-card/arrow-red.svg'} alt="arrow" />
          </div>
          <div className={styles.tableInfo}>
            <img src="/assets/image/info-card/location.svg" alt="위치" />
            <span className={styles.tableNumber}>{tableNumber}</span>
          </div>
        </div>

        <div className={styles.customerSection}>
          <div className={styles.customerHeader}>
            <div className={styles.tags}>
              {isVip && (
                <div className={`${styles.tag} ${styles.vipTag}`}>
                  <img src={'/assets/image/info-card/tag-vip.svg'} alt="VIP" />
                </div>
              )}
              {hasTeamTag && (
                <div className={`${styles.tag} ${styles.teamTag}`}>
                  <img src={'/assets/image/info-card/tag-team.svg'} alt="팀" />
                </div>
              )}
            </div>
            <div className={styles.customerInfo}>
              <div className={styles.customerMain}>
                <span className={styles.customerName}>
                  {customerInfo.name}({customerInfo.group})
                </span>
                <span className={styles.customerTime}>{customerInfo.time}</span>
              </div>
              <img src="/assets/image/info-card/meassage.svg" alt="메시지" />
            </div>
          </div>
          <div className={styles.membersList}>
            {customerInfo.members.join(' ')}
          </div>
        </div>

        {!isHistoryCard && (
          <div className={styles.orderSection}>
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
        )}

        {isHistoryCard && (
          <div className={styles.historyOrderSection}>
            {orderHistory.map((history) => (
              <div key={history.id} className={styles.orderSection}>
                <div
                  className={styles.orderSummary}
                  onClick={() => toggleHistoryExpansion(history.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={styles.totalItems}>총 {history.totalItems}개</span>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderLabel}>주문 정보</span>
                    <div className={styles.orderDetails}>
                      <span className={styles.orderTimeText}>{history.orderTime}</span>
                      <span className={styles.orderLocationText}>({history.orderLocation})</span>
                    </div>
                  </div>
                </div>

                {expandedHistoryIds.has(history.id) && (
                  <div className={styles.orderItems}>
                    {history.items.map((item, index) => (
                      <div key={index} className={`${styles.orderItem} ${styles.historyOrderItem}`}>
                        <div className={styles.itemName}>
                          <span>{item.name}</span>
                        </div>
                        <div className={styles.itemQuantity}>
                          <span>{item.quantity}개</span>
                        </div>
                      </div>
                    ))}

                    {history.specialRequest && (
                      <div className={styles.specialRequest}>
                        <span>[요청] {history.specialRequest}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className={styles.orderSection}>
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

              <div className={styles.orderItems}>
                {orderItems.map((item, index) => (
                  <div key={index} className={`${styles.orderItem} ${styles.historyOrderItem}`}>
                    <div className={styles.itemName}>
                      <span>{item.name}</span>
                    </div>
                    <div className={styles.itemQuantity}>
                      <span>{item.quantity}개</span>
                    </div>
                  </div>
                ))}

                {specialRequest && (
                  <div className={styles.specialRequest}>
                    <span>[요청] {specialRequest}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isHistoryCard && isCompleteStatus && (
          <div className={styles.totalSection}>
            <div className={styles.totalLabel}>주문 합계</div>
            <div className={styles.totalAmount}>{formatPrice(totalAmount)}원</div>
          </div>
        )}
      </div>

      {!isHistoryCard && (
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
      )}
    </div>
  );
};

export default InfoCard;