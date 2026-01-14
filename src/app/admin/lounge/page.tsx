'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import SideTab from '@/components/admin/layout/SideTab';
import HeaderBar from '@/components/admin/layout/HeaderBar';
import InfoCard from '@/components/admin/contents/InfoCard';
import { mockAvailableTables } from '@/mock/admin/infocardMockData';
import styles from '@/styles/pages/admin/lounge.module.scss';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { useHorizontalScroll } from '@/hooks/common/useScrollManagement';
import { useBillListByStatus } from '@/hooks/api';
import { transformBillToInfoCard } from '@/utils/mappers/billMappers';
import { OrderCounts } from '@/types';

const mapFilterToStatus = (filter: string): string => {
  switch (filter) {
    case 'order': return 'R';    // 접수
    case 'accept': return 'P';   // 진행중
    case 'complete': return 'Y'; // 완료
    case 'cancel': return 'N';   // 취소
    default: return 'R';
  }
};

const Lounge = () => {
  const [activeFilter, setActiveFilter] = useState<string>('order');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [isCardScrolled, setIsCardScrolled] = useState(false);
  const [isCardScrolledToEnd, setIsCardScrolledToEnd] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const previousOrderCountRef = useRef<number>(0);

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { openCancelOrderModal, openSendMessageModal } = useUnifiedModal();
  const { handleScroll } = useHorizontalScroll();

  // 상태별 Bill 데이터 조회 (접수만 5초 리페치)
  const billStatus = mapFilterToStatus(activeFilter);
  const { billList = [], isLoading } = useBillListByStatus(billStatus, {
    refetchInterval: activeFilter === 'order' ? 5000 : undefined,
    enabled: true,
  });

  // Bill 데이터를 InfoCard 형식으로 변환
  const filteredCards = useMemo(
    () => billList.map(bill => transformBillToInfoCard(bill)),
    [billList]
  );

  const currentCard = filteredCards[selectedCardIndex] || filteredCards[0];

  // 전체 주문 카운트 계산 (모든 상태의 데이터 필요)
  const { billList: orderBills = [] } = useBillListByStatus('R', { enabled: true });
  const { billList: acceptBills = [] } = useBillListByStatus('P', { enabled: true });
  const { billList: completeBills = [] } = useBillListByStatus('Y', { enabled: true });
  const { billList: cancelBills = [] } = useBillListByStatus('N', { enabled: true });

  // 새로운 접수 주문 감지
  React.useEffect(() => {
    const currentOrderCount = orderBills.length;
    if (previousOrderCountRef.current > 0 && currentOrderCount > previousOrderCountRef.current) {
      setHasNewOrders(true);
    }
    previousOrderCountRef.current = currentOrderCount;
  }, [orderBills.length]);

  const orderCounts: OrderCounts = useMemo(() => ({
    all: orderBills.length + acceptBills.length + completeBills.length + cancelBills.length,
    order: orderBills.length,
    accept: acceptBills.length,
    complete: completeBills.length,
    cancel: cancelBills.length,
  }), [orderBills, acceptBills, completeBills, cancelBills]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSelectedCardIndex(0);
    // 필터 변경 시 알림 초기화
    if (filter === 'order') {
      setHasNewOrders(false);
    }
  };

  const handleHeaderExpandedChange = (expanded: boolean) => {
    setIsHeaderExpanded(expanded);
  };

  const handleCardScroll = useCallback(() => {
    if (cardContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cardContainerRef.current;
      setIsCardScrolled(scrollLeft > 0);
      setIsCardScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  }, []);

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

  const renderScrollButton = (direction: 'left' | 'right', isVisible: boolean) => (
    <div className={`${styles.scrollButton} ${styles[direction]} ${isVisible ? styles.visible : styles.hidden}`}>
      <button className={styles.scrollButtonBackground} onClick={() => handleScroll(cardContainerRef, direction)}>
          <img src="/assets/image/global/arrow/scroll-arrow.svg" alt={`scroll-${direction}`} />
      </button>
    </div>
  );

  return (
    <div className={styles.loungeContainer}>
      <SideTab
        orderCounts={orderCounts}
        onFilterChange={handleFilterChange}
        hasNotification={hasNewOrders}
      />

      <div className={styles.mainContent}>
        <HeaderBar
          onExpandedChange={handleHeaderExpandedChange}
        />
        <div
          className={`${styles.scrollButtonWrapper} ${
            isHeaderExpanded ? styles.scrollButtonExpanded : styles.scrollButtonCollapsed
          }`}
        >
          {filteredCards.length > 0 && renderScrollButton('left', isCardScrolled)}
          <div
            className={`${styles.infoCardContainer} ${isHeaderExpanded ? styles.headerExpanded : styles.headerCollapsed}`}
            ref={cardContainerRef}
            onScroll={handleCardScroll}
          >
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <p>로딩 중...</p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className={styles.emptyContent}>
                <p>주문이 없습니다.</p>
              </div>
            ) : (
              filteredCards.map((card, index) => (
                <InfoCard
                  key={index}
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
              ))
            )}
          </div>
          {filteredCards.length > 0 && renderScrollButton('right', !isCardScrolledToEnd)}
        </div>
      </div>
    </div>
  );
};

export default Lounge;
