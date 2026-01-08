'use client';

import React, { useState, useMemo } from 'react';
import SideTab from '@/components/admin/layout/SideTab';
import HeaderBar from '@/components/admin/layout/HeaderBar';
import InfoCard from '@/components/admin/contents/InfoCard';
import { mockInfoCards, mockAvailableTables } from '@/mock/admin/infocardMockData';
import styles from '@/styles/pages/admin/lounge.module.scss';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { getOrderCounts } from '@/utils';

const Lounge = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<'lake' | 'hill'>('lake');
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

  const { openCancelOrderModal, openSendMessageModal } = useUnifiedModal();

  const filteredCards = useMemo(() => {
    if (activeFilter === 'all') {
      return mockInfoCards;
    }
    return mockInfoCards.filter(card => card.status === activeFilter);
  }, [activeFilter]);

  const currentCard = filteredCards[selectedCardIndex] || filteredCards[0];

  const orderCounts = useMemo(() => getOrderCounts(mockInfoCards), []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSelectedCardIndex(0);
  };

  const handleHeaderExpandedChange = (expanded: boolean) => {
    setIsHeaderExpanded(expanded);
  };

  const handleCourseChange = (courseType: 'lake' | 'hill') => {
    setSelectedCourse(courseType);
  };

  const handleAcceptOrder = () => {
  };

  const handleCancelOrder = () => {
    openCancelOrderModal(
      () => {
        alert('주문이 취소되었습니다.');
      },
      () => {
      }
    );
  };

  const handleMessageOrder = () => {
    const availableRecipients = [
      '홀 매니저',
      '주방장',
      '서빙팀',
      '고객 서비스',
      currentCard?.customerInfo?.name || '고객'
    ];

    openSendMessageModal(
      availableRecipients,
      (formData) => {
        alert(`메시지가 ${formData.recipient}에게 전송되었습니다.`);
      },
      () => {
      }
    );
  };

  const handleCompleteOrder = () => {
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
        <HeaderBar
          onCourseChange={handleCourseChange}
          onExpandedChange={handleHeaderExpandedChange}
        />
        <div className={`${styles.infoCardContainer} ${isHeaderExpanded ? styles.headerExpanded : styles.headerCollapsed}`}>
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
    </div>
  );
};

export default Lounge;