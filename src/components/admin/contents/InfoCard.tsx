'use client';

import React, {useMemo} from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import {Bill, BillOrderStatus} from '@/types/bill.type';
import {GpsBookingType} from '@/types/booking.type';
import {CustomerInfo, OrderHistory, OrderItemSummary, OrderStatus} from '@/types';
import {useHistoryExpansion} from '@/hooks/admin/useHistoryExpansion';
import {TableOption, useTableSelection} from '@/hooks/admin/useTableSelection';
import InfoCardHeader from './infocard/InfoCardHeader';
import CustomerInfoSection from './infocard/CustomerInfoSection';
import OrderItemsList from './infocard/OrderItemsList';
import OrderHistorySection from './infocard/OrderHistorySection';
import InfoCardActions from './infocard/InfoCardActions';

export interface InfoCardProps {
  bill: Bill;
  booking?: GpsBookingType;
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
  booking,
  onAcceptOrder,
  onCancelOrder,
  onCompleteOrder,
  onMessageOrder,
  availableTables = [],
}) => {
  const { toggleExpansion, isExpanded } = useHistoryExpansion();
  const { isDropdownOpen, selectedTable, selectedTableId, toggleDropdown, selectTable } = useTableSelection({
    tableId: bill.tableId,
    tableLabel: bill.tableNo || null,
  });

  const orderList = bill.orderList ?? [];
  const latestOrder = useMemo(() => {
    if (orderList.length === 0) return undefined;
    return orderList.reduce((latest, current) =>
      current.orderId > latest.orderId ? current : latest
    );
  }, [orderList]);
  const firstOrder = orderList[0];
  const status = firstOrder ? mapBillStatusToOrderStatus(firstOrder.orderSt) : 'order';
  const isAcceptStatus = status === 'accept';
  const isCancelStatus = status === 'cancel';
  const currentOrderList = isAcceptStatus && latestOrder ? [latestOrder] : orderList;
  const historyOrderList = isAcceptStatus && latestOrder
    ? orderList.filter((order) => order.orderId !== latestOrder.orderId)
    : orderList;

  const customerInfo: CustomerInfo = useMemo(() => ({
    name: bill.bookingNm || '-',
    group: bill.bookingsNm || '-',
    time: formatTime(bill.bookingTm),
    members: bill.playerList ? bill.playerList.split(',').map(p => p.trim()) : [],
  }), [bill]);

  const orderItems: OrderItemSummary[] = useMemo(() =>
    currentOrderList.flatMap(order =>
      (order.orderHisList ?? []).map(item => ({
        name: item.goodsNm,
        quantity: item.orderCnt,
        price: item.orderAmt,
      }))
    ), [currentOrderList]
  );

  const orderHistory: OrderHistory[] = useMemo(() =>
    historyOrderList.map(order => ({
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
      cancelReason: order.orderRea || undefined,
      playerName: order.playerNm || undefined,
    })), [historyOrderList]
  );

  const totalItems = useMemo(() =>
    orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems]
  );

  const mainOrder = currentOrderList[0];
  const orderTime = mainOrder ? formatTime(mainOrder.createdDt) : '-';

  const orderLocation = mainOrder && mainOrder.courseNm && mainOrder.holeNo !== null && mainOrder.holeNo !== undefined
    ? `${mainOrder.courseNm} ${mainOrder.holeNo}H`
    : '-';
  const orderPlayerName = mainOrder?.playerNm ?? null;
  const orderCourseName = mainOrder?.courseNm ?? null;
  const orderHoleNo = mainOrder?.holeNo ?? null;

  const specialRequest = mainOrder?.orderReq || undefined;

  const cancelReason = orderList
    .filter(order => order.orderRea)
    .map(order => order.orderRea)
    .join(', ') || undefined;

  const realTimeLocation = useMemo(() => {
    if (booking && booking.courseNm && booking.holeNo !== null && booking.holeNo !== undefined) {
      return `${booking.courseNm} ${booking.holeNo}H`;
    }
    return '스타트하우스';
  }, [booking]);

  const tags = useMemo(() => {
    const bookingTags = booking?.tags ?? [];
    if (bill.isERP && !bookingTags.includes('ERP')) {
      return [...bookingTags, 'ERP'];
    }
    return bookingTags;
  }, [booking?.tags, bill.isERP]);

  const tableNumber = bill.tableNo || '';
  const totalAmount = bill.billAmt;

  const isOrderCard = status === 'order';
  const isCompleteStatus = status === 'complete';
  const isDisabledStatus = isCompleteStatus || isCancelStatus;

  const borderColor = isOrderCard ? '#9081D8' : '#D9D9D9';

  return (
    <div
      className={`${styles.infoCard} ${isOrderCard ? styles.historyCard : styles.newCard} ${isDisabledStatus ? styles.disabledCard : ''}`}
      style={{
        border: `2px solid ${borderColor}`,
        boxShadow: isOrderCard ? '0px 0px 10px rgba(144, 129, 216, 0.50)' : 'none',
      }}
    >
      <div className={styles.content}>
        <InfoCardHeader
          tableNumber={tableNumber}
          realTimeLocation={realTimeLocation}
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

        {(isOrderCard || isAcceptStatus || isCancelStatus) && (
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
