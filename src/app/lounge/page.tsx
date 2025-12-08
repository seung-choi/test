'use client';

import React, { useState, useMemo } from 'react';
import SideTab from '@/components/lounge/layout/SideTab';
import InfoCard from '@/components/lounge/contents/InfoCard';
import { mockInfoCards, getOrderCounts } from '@/mock/infocardMockData';
import styles from '@/styles/pages/lounge/lounge.module.scss';
import CancelModal from '@/components/CancelModal';

const Lounge = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCards = useMemo(() => {
    if (activeFilter === 'all') {
      return mockInfoCards;
    }
    return mockInfoCards.filter(card => card.status === activeFilter);
  }, [activeFilter]);

  const currentCard = filteredCards[selectedCardIndex] || filteredCards[0];

  const orderCounts = useMemo(() => getOrderCounts(mockInfoCards), []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSelectedCardIndex(0);
  };

  const handleAcceptOrder = () => {
    console.log('주문 수락:', currentCard?.id);
  };

  const handleCancelOrder = () => {
    handleOpenModal()
  };

  const handleCompleteOrder = () => {
    console.log('정산 완료:', currentCard?.id);
  };

  if (!currentCard) {
    return (
      <div className={styles.loungeContainer}>
        <SideTab
          orderCounts={orderCounts}
          onFilterChange={handleFilterChange}
          hasNotification={true}
        />
        <div className={styles.emptyContent}>
          <p>표시할 주문이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loungeContainer}>
      <SideTab
        orderCounts={orderCounts}
        onFilterChange={handleFilterChange}
        hasNotification={orderCounts.order > 0}
      />

      <div className={styles.mainContent}>
        <div className={styles.cardContainer}>
          <InfoCard
            cardType={currentCard.cardType}
            tableType={currentCard.tableType}
            tableNumber={currentCard.tableNumber}
            customerInfo={currentCard.customerInfo}
            orderItems={currentCard.orderItems}
            orderHistory={currentCard.orderHistory}
            specialRequest={currentCard.specialRequest}
            totalItems={currentCard.totalItems}
            orderTime={currentCard.orderTime}
            orderLocation={currentCard.orderLocation}
            isVip={currentCard.isVip}
            hasTeamTag={currentCard.hasTeamTag}
            status={currentCard.status}
            cancelReason={currentCard.cancelReason}
            totalAmount={currentCard.totalAmount}
            onAcceptOrder={handleAcceptOrder}
            onCancelOrder={handleCancelOrder}
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </div>
      <CancelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCancel={handleCancelOrder}
        title="주문 취소 사유"
      />

    </div>
  );
};

export default Lounge;