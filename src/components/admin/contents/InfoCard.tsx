'use client';

import React, { useMemo } from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { Bill, BillOrderStatus } from '@/types/bill.type';
import { CustomerInfo, OrderItemSummary, OrderHistory, OrderStatus } from '@/types';
import { useHistoryExpansion } from '@/hooks/admin/useHistoryExpansion';
import { TableOption, useTableSelection } from '@/hooks/admin/useTableSelection';
import InfoCardHeader from './infocard/InfoCardHeader';
import CustomerInfoSection from './infocard/CustomerInfoSection';
import OrderItemsList from './infocard/OrderItemsList';
import OrderHistorySection from './infocard/OrderHistorySection';
import InfoCardActions from './infocard/InfoCardActions';

export interface InfoCardProps {
  bill: Bill;
  onAcceptOrder?: (tableId: number | null) => void;
  onCancelOrder?: () => void;
  onCompleteOrder?: () => void;
  onMessageOrder?: () => void;
  availableTables?: TableOption[];
}

const mapBillStatusToOrderStatus = (billOrderStatus: BillOrderStatus): OrderStatus => {
  switch (billOrderStatus) {
    case 'R': return 'order';    // 접수
    case 'P': return 'accept';   // 진행중
    case 'N': return 'cancel';   // 취소
    case 'Y': return 'complete'; // 완료
    default: return 'order';
  }
};

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

const InfoCard: React.FC<InfoCardProps> = ({
  bill,
  onAcceptOrder,
  onCancelOrder,
  onCompleteOrder,
  onMessageOrder,
  availableTables = [],
}) => {
  const { toggleExpansion, isExpanded } = useHistoryExpansion();
  const { isDropdownOpen, selectedTable, selectedTableId, toggleDropdown, selectTable } = useTableSelection();

  const orderList = bill.orderList ?? [];
  const firstOrder = orderList[0];
  const status = firstOrder ? mapBillStatusToOrderStatus(firstOrder.orderSt) : 'order';

  const customerInfo: CustomerInfo = useMemo(() => ({
    name: bill.bookingNm || '-',
    group: bill.bookingsNm || '-',
    time: formatTime(bill.bookingTm),
    members: bill.playerList ? bill.playerList.split(',').map(p => p.trim()) : [],
  }), [bill]);

  const orderItems: OrderItemSummary[] = useMemo(() =>
    orderList.flatMap(order =>
      (order.orderHisList ?? []).map(item => ({
        name: item.goodsNm,
        quantity: item.orderCnt,
        price: item.orderAmt,
      }))
    ), [orderList]
  );

  const orderHistory: OrderHistory[] = useMemo(() =>
    orderList.map(order => ({
      id: String(order.orderId),
      status: mapBillStatusToOrderStatus(order.orderSt),
      totalItems: (order.orderHisList ?? []).reduce((sum, item) => sum + item.orderCnt, 0),
      orderTime: formatTime(order.createdDt),
      orderLocation: order.courseNm && order.holeNo !== null && order.holeNo !== undefined
        ? `${order.courseNm} ${order.holeNo}H`
        : '-',
      items: (order.orderHisList ?? []).map(item => ({
        name: item.goodsNm,
        quantity: item.orderCnt,
        price: item.orderAmt,
      })),
      specialRequest: order.orderReq || undefined,
    })), [orderList]
  );

  const totalItems = useMemo(() =>
    orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems]
  );

  const orderTime = firstOrder ? formatTime(firstOrder.createdDt) : '-';

  const orderLocation = firstOrder && firstOrder.courseNm && firstOrder.holeNo !== null && firstOrder.holeNo !== undefined
    ? `${firstOrder.courseNm} ${firstOrder.holeNo}H`
    : '-';
  const orderPlayerName = firstOrder?.playerNm ?? null;
  const orderCourseName = firstOrder?.courseNm ?? null;
  const orderHoleNo = firstOrder?.holeNo ?? null;

  const specialRequest = firstOrder?.orderReq || undefined;

  const cancelReason = orderList
    .filter(order => order.orderRea)
    .map(order => order.orderRea)
    .join(', ') || undefined;

  const tags = bill.isERP ? ['ERP'] : [];
  const tableNumber = bill.tableNo || '';
  const totalAmount = bill.billAmt;

  const isOrderCard = status === 'order';
  const isCompleteStatus = status === 'complete';
  const isCancelStatus = status === 'cancel';
  const isDisabledStatus = isCompleteStatus || isCancelStatus;

  const borderColor = isOrderCard ? '#9081D8' : '#D9D9D9';
  const hasShadow = isOrderCard;

  return (
    <div
      className={`${styles.infoCard} ${isOrderCard ? styles.historyCard : styles.newCard} ${isDisabledStatus ? styles.disabledCard : ''}`}
      style={{
        border: `2px solid ${borderColor}`,
        boxShadow: hasShadow ? '0px 0px 10px rgba(144, 129, 216, 0.50)' : 'none',
      }}
    >
      <div className={styles.content}>
        <InfoCardHeader
          tableNumber={tableNumber}
          orderLocation={orderLocation}
          selectedTable={selectedTable}
          isDropdownOpen={isDropdownOpen}
          isDisabledStatus={isDisabledStatus}
          availableTables={availableTables}
          onToggleDropdown={toggleDropdown}
          onSelectTable={selectTable}
        />

        <CustomerInfoSection
          customerInfo={customerInfo}
          tags={tags}
          onMessageClick={onMessageOrder}
        />

        <OrderItemsList
          totalItems={totalItems}
          orderTime={orderTime}
          orderLocation={orderLocation}
          orderItems={orderItems}
          orderPlayerName={orderPlayerName}
          orderCourseName={orderCourseName}
          orderHoleNo={orderHoleNo}
          specialRequest={specialRequest}
          status={status}
        />

        {isOrderCard && (
          <OrderHistorySection
            orderHistory={orderHistory}
            isExpanded={isExpanded}
            onToggleExpansion={toggleExpansion}
          />
        )}
      </div>

      <InfoCardActions
        status={status}
        cancelReason={cancelReason}
        totalAmount={totalAmount}
        selectedTableId={selectedTableId}
        onAcceptOrder={onAcceptOrder}
        onCancelOrder={onCancelOrder}
        onCompleteOrder={onCompleteOrder}
      />
    </div>
  );
};

export default InfoCard;
