'use client';

import React, { useState, useMemo } from 'react';
import SideTab from '@/components/lounge/layout/SideTab';
import HeaderBar from '@/components/lounge/layout/HeaderBar';
import InfoCard from '@/components/lounge/contents/InfoCard';
import { mockInfoCards, mockAvailableTables } from '@/mock/infocardMockData';
import { mockCourseData } from '@/mock/courseMockData';
import styles from '@/styles/pages/lounge/lounge.module.scss';
import CancelModal from '@/components/CancelModal';
import { getOrderCounts } from '@/utils';

const Lounge = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<'lake' | 'hill'>('lake');

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

  const handleCourseChange = (courseType: 'lake' | 'hill') => {
    setSelectedCourse(courseType);
    console.log('선택된 코스:', courseType);
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

  const handleMessageOrder = () => {
    setIsModalOpen(true)
  }

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
        <HeaderBar
          courseData={mockCourseData}
          onCourseChange={handleCourseChange}
        />
        <div className={styles.infoCardContainer}>
          {filteredCards.map((card, index) => (
            <InfoCard
              key={card.id || index}
              tableNumber={card.tableNumber}
              customerInfo={card.customerInfo}
              orderItems={card.orderItems}
              orderHistory={card.orderHistory}
              specialRequest={card.specialRequest}
              totalItems={card.totalItems}
              orderTime={card.orderTime}
              orderLocation={card.orderLocation}
              tags={card.tags}
              status={card.status}
              cancelReason={card.cancelReason}
              totalAmount={card.totalAmount}
              onAcceptOrder={handleAcceptOrder}
              onCancelOrder={handleCancelOrder}
              onCompleteOrder={handleCompleteOrder}
              onMessageOrder={handleMessageOrder}
              availableTables={mockAvailableTables}
            />
          ))}
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