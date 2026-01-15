'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import SideTab from '@/components/admin/layout/SideTab';
import HeaderBar from '@/components/admin/layout/HeaderBar';
import InfoCard from '@/components/admin/contents/InfoCard';
import styles from '@/styles/pages/admin/lounge.module.scss';
import useUnifiedModal from '@/hooks/admin/useUnifiedModal';
import { useHorizontalScroll } from '@/hooks/common/useScrollManagement';
import { useToast } from '@/hooks/common/useToast';
import { useBillListByStatus, useBookingList, useDeleteBill, useDeleteBillOrderList, usePatchBill, usePatchBillComplete, usePutBillErp, usePostEventMsgSend, useTableList } from '@/hooks/api';
import { Bill, OrderCounts, ErpLinkSelection } from '@/types';
import { BillOrderStatus } from '@/types/bill.type';
import storage from '@/utils/storage';

const Lounge = () => {
  const [activeFilter, setActiveFilter] = useState<BillOrderStatus>('R');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [isCardScrolled, setIsCardScrolled] = useState(false);
  const [isCardScrolledToEnd, setIsCardScrolledToEnd] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const previousOrderSignatureRef = useRef<string>('');

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { openCancelOrderModal, openSendMessageModal, openErpLinkModal } = useUnifiedModal();
  const { handleScroll } = useHorizontalScroll();
  const { showToast } = useToast();
  const { mutate: deleteBill } = useDeleteBill();
  const { mutate: deleteBillOrderList } = useDeleteBillOrderList();
  const { mutate: postEventMsgSend } = usePostEventMsgSend();
  const { mutate: patchBill } = usePatchBill();
  const { mutate: patchBillComplete } = usePatchBillComplete();
  const { mutate: putBillErp } = usePutBillErp();
  const { data: tableList = [] } = useTableList();
  const { data: bookingList = [] } = useBookingList({ refetchInterval: 5000 });

  const billStatus = activeFilter;
  const { billList = [], isLoading } = useBillListByStatus(billStatus, {
    refetchInterval: activeFilter === 'R' ? 5000 : undefined,
    enabled: true,
  });

  const { billList: orderBills = [] } = useBillListByStatus('R', { enabled: true, refetchInterval: 3000 });
  const { billList: acceptBills = [] } = useBillListByStatus('P', { enabled: true });
  const { billList: completeBills = [] } = useBillListByStatus('Y', { enabled: true });
  const { billList: cancelBills = [] } = useBillListByStatus('N', { enabled: true });

  React.useEffect(() => {
    const signature = orderBills
      .map((bill) => `${bill.billId}:${bill.modifiedDt}`)
      .sort()
      .join('|');
    const hasPrevious = previousOrderSignatureRef.current.length > 0;
    if (hasPrevious && signature !== previousOrderSignatureRef.current && activeFilter !== 'R') {
      setHasNewOrders(true);
    }
    previousOrderSignatureRef.current = signature;
  }, [orderBills, activeFilter]);

  const orderCounts: OrderCounts = useMemo(() => ({
    all: orderBills.length + acceptBills.length + completeBills.length + cancelBills.length,
    R: orderBills.length,
    P: acceptBills.length,
    Y: completeBills.length,
    N: cancelBills.length,
  }), [orderBills, acceptBills, completeBills, cancelBills]);

  const handleFilterChange = (filter: BillOrderStatus) => {
    setActiveFilter(filter);
    setSelectedCardIndex(0);
    if (filter === 'R') {
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

  const bookingMap = useMemo(() => {
    const map = new Map<number, typeof bookingList[0]>();
    bookingList.forEach((booking) => {
      map.set(booking.bookingId, booking);
    });
    return map;
  }, [bookingList]);

  const handleCardScroll = useCallback(() => {
    if (cardContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cardContainerRef.current;
      setIsCardScrolled(scrollLeft > 0);
      setIsCardScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  }, []);

  const handleAcceptOrder = (bill: Bill) => (tableId: number | null) => {
    if (bill.isERP) {
      patchBill({ billId: bill.billId, tableId });
    } else {
      openErpLinkModal(
        bill.billId,
        tableId,
        (selection: ErpLinkSelection) => {
          putBillErp(
            {
              billId: bill.billId,
              tableId: tableId ?? 0,
              data: {
                bookingErp: selection.bookingErp,
                playerNm: selection.playerNm,
                playerErp: selection.playerErp,
              },
            },
            {
              onSuccess: () => {
                showToast('ERP 연동이 완료되었습니다.', 'success');
              },
              onError: (error) => {
                console.error('ERP 연동 실패:', error);
                showToast('ERP 연동에 실패했습니다.', 'error');
              },
            }
          );
        },
        () => {
          patchBill({ billId: bill.billId, tableId });
        }
      );
    }
  };

  const handleCancelOrder = (bill: Bill) => () => {
    const orderStatus = bill.orderList?.[0]?.orderSt;
    const isAcceptStatus = orderStatus === 'P';
    const modalOrderList = isAcceptStatus ? bill.orderList ?? [] : [];

    openCancelOrderModal(
      ({ reason, orderIdList }) => {
        if (isAcceptStatus) {
          deleteBillOrderList(
            { billId: bill.billId, data: { orderRea: reason, orderIdList } },
            {
              onSuccess: () => {
                showToast('주문이 취소되었습니다.', 'success');
              },
              onError: (error) => {
                console.error('주문 취소 실패:', error);
                showToast('주문 취소에 실패했습니다.', 'error');
              }
            }
          );
          return;
        }

        deleteBill(
          { billId: bill.billId, data: { orderRea: reason } },
          {
            onSuccess: () => {
              showToast('주문이 취소되었습니다.', 'success');
            },
            onError: (error) => {
              console.error('주문 취소 실패:', error);
              showToast('주문 취소에 실패했습니다.', 'error');
            }
          }
        );
      },
      () => {
        // 취소 버튼 클릭 시
      },
      {
        orderList: modalOrderList,
        isOrderSelectionRequired: isAcceptStatus,
      }
    );
  };

  const handleMessageOrder = (bill: Bill) => () => {
    const userId = String(storage.session.get('userId') || '');
    const userNm = String(storage.session.get('userNm') || '');
    openSendMessageModal(
      [bill.bookingNm || ''],
      (data) => {
        postEventMsgSend(
          {
            fromId: userId,
            fromNm: userNm,
            toId: String(bill.bookingId ?? ''),
            toNm: data.recipient || bill.bookingNm || '',
            eventCont: data.content,
            eventImg: data.image,
          },
          {
            onSuccess: () => {
              showToast('메시지가 전송되었습니다.', 'success');
            },
            onError: (error) => {
              console.error('메시지 전송 실패:', error);
              showToast('메시지 전송에 실패했습니다.', 'error');
            },
          }
        );
      },
      undefined,
      bill.bookingId,
    );
  };

  const handleCompleteOrder = (billId: number) => () => {
    patchBillComplete(billId);
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
              billList.map((bill) => (
                <InfoCard
                  key={bill.billId}
                  bill={bill}
                  booking={bill.bookingId ? bookingMap.get(bill.bookingId) : undefined}
                  onAcceptOrder={handleAcceptOrder(bill)}
                  onCancelOrder={handleCancelOrder(bill)}
                  onCompleteOrder={handleCompleteOrder(bill.billId)}
                  onMessageOrder={handleMessageOrder(bill)}
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
