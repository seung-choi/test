'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import SideTab from '@/components/admin/layout/SideTab';
import HeaderBar from '@/components/admin/layout/HeaderBar';
import InfoCard from '@/components/admin/contents/InfoCard';
import styles from '@/styles/pages/admin/lounge.module.scss';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { useHorizontalScroll } from '@/hooks/common/useScrollManagement';
import { useBillListByStatus, useDeleteBill, usePatchBill, useTableList } from '@/hooks/api';
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
  const { mutate: deleteBill } = useDeleteBill();
  const { mutate: patchBill } = usePatchBill();
  const { data: tableList = [] } = useTableList();

  const billStatus = mapFilterToStatus(activeFilter);
  const { billList = [], isLoading } = useBillListByStatus(billStatus, {
    refetchInterval: activeFilter === 'order' ? 5000 : undefined,
    enabled: true,
  });

  const { billList: orderBills = [] } = useBillListByStatus('R', { enabled: true });
  const { billList: acceptBills = [] } = useBillListByStatus('P', { enabled: true });
  const { billList: completeBills = [] } = useBillListByStatus('Y', { enabled: true });
  const { billList: cancelBills = [] } = useBillListByStatus('N', { enabled: true });

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

  const handleMessageNotificationClear = () => {
    setHasNewOrders(false);
  };

  const handleHeaderExpandedChange = (expanded: boolean) => {
    setIsHeaderExpanded(expanded);
  };

  const availableTables = useMemo(
    () =>
      tableList
        .filter((table) => Boolean(table.tableNo && table.tableId))
        .map((table) => ({
          id: table.tableId,
          label: `${table.tableNo}${table.tableNo.endsWith('번') ? '' : '번'}`
        })),
    [tableList]
  );

  const handleCardScroll = useCallback(() => {
    if (cardContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cardContainerRef.current;
      setIsCardScrolled(scrollLeft > 0);
      setIsCardScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  }, []);

  const handleAcceptOrder = (billId: number) => (tableId: number | null) => {
    if (tableId !== null) {
      patchBill({ billId, tableId });
    }
  };

  const handleCancelOrder = (billId: number) => () => {
    openCancelOrderModal(
      (reason: string) => {
        deleteBill(
          { billId, data: { orderRea: reason } },
          {
            onSuccess: () => {
              alert('주문이 취소되었습니다.');
            },
            onError: (error) => {
              console.error('주문 취소 실패:', error);
              alert('주문 취소에 실패했습니다.');
            }
          }
        );
      },
      () => {
        // 취소 버튼 클릭 시
      }
    );
  };

  const handleMessageOrder = (billId: number) => () => {
    openSendMessageModal(
      ['홀 매니저', '주방장', '서빙팀', '고객 서비스'],
      () => {
        alert('메시지가 전송되었습니다.');
      },
    );
  };

  const handleCompleteOrder = (billId: number) => () => {
    // TODO: 주문 완료 로직
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
        onMessageNotificationClear={handleMessageNotificationClear}
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
          {billList.length > 0 && renderScrollButton('left', isCardScrolled)}
          <div
            className={`${styles.infoCardContainer} ${isHeaderExpanded ? styles.headerExpanded : styles.headerCollapsed}`}
            ref={cardContainerRef}
            onScroll={handleCardScroll}
          >
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <p>로딩 중...</p>
              </div>
            ) : billList.length === 0 ? (
              <div className={styles.emptyContent}>
                <p>주문이 없습니다.</p>
              </div>
            ) : (
              billList.map((bill, index) => (
                <InfoCard
                  key={bill.billId}
                  bill={bill}
                  onAcceptOrder={handleAcceptOrder(bill.billId)}
                  onCancelOrder={handleCancelOrder(bill.billId)}
                  onCompleteOrder={handleCompleteOrder(bill.billId)}
                  onMessageOrder={handleMessageOrder(bill.billId)}
                  availableTables={availableTables}
                />
              ))
            )}
          </div>
          {billList.length > 0 && renderScrollButton('right', !isCardScrolledToEnd)}
        </div>
      </div>
    </div>
  );
};

export default Lounge;
