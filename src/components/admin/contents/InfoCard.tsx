'use client';

import React from 'react';
import styles from '@/styles/components/admin/contents/InfoCard.module.scss';
import { CustomerInfo, OrderItemSummary, OrderHistory, OrderStatus } from '@/types';
import { useHistoryExpansion } from '@/hooks/admin/useHistoryExpansion';
import { useTableSelection } from '@/hooks/admin/useTableSelection';
import InfoCardHeader from './infocard/InfoCardHeader';
import CustomerInfoSection from './infocard/CustomerInfoSection';
import OrderItemsList from './infocard/OrderItemsList';
import OrderHistorySection from './infocard/OrderHistorySection';
import InfoCardActions from './infocard/InfoCardActions';

export interface InfoCardProps {
  tableNumber: string;
  customerInfo: CustomerInfo;
  orderItems?: OrderItemSummary[];
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
  const { toggleExpansion, isExpanded } = useHistoryExpansion();
  const { isDropdownOpen, selectedTable, toggleDropdown, selectTable } = useTableSelection(onTableSelect);

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
        onAcceptOrder={onAcceptOrder}
        onCancelOrder={onCancelOrder}
        onCompleteOrder={onCompleteOrder}
      />
    </div>
  );
};

export default InfoCard;