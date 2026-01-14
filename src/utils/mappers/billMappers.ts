import { Bill, BillOrderStatus } from '@/types/bill.type';
import { OrderStatus, OrderHistory, OrderItemSummary, CustomerInfo } from '@/types';
import { InfoCardProps } from '@/components/admin/contents/InfoCard';

export const mapBillStatusToOrderStatus = (billOrderStatus: BillOrderStatus): OrderStatus => {
  switch (billOrderStatus) {
    case 'R': return 'order';    // 접수
    case 'P': return 'accept';   // 진행중
    case 'N': return 'cancel';   // 취소
    case 'Y': return 'complete'; // 완료
    default: return 'order';
  }
};

export const formatBookingTime = (bookingTm: { hour: number; minute: number }): string => {
  return `${String(bookingTm.hour).padStart(2, '0')}:${String(bookingTm.minute).padStart(2, '0')}`;
};

export const transformBillToInfoCard = (bill: Bill): Omit<InfoCardProps, 'onAcceptOrder' | 'onCancelOrder' | 'onCompleteOrder' | 'onMessageOrder' | 'onTableSelect' | 'availableTables'> => {
  // 첫 번째 주문의 상태를 카드 상태로 사용
  const firstOrder = bill.orderList[0];
  const status = firstOrder ? mapBillStatusToOrderStatus(firstOrder.orderSt) : 'order';

  // 고객 정보 변환
  const customerInfo: CustomerInfo = {
    name: bill.bookingNm || '-',
    group: bill.bookingsNm || '-',
    time: formatBookingTime(bill.bookingTm),
    members: bill.playerList ? bill.playerList.split(',').map(p => p.trim()) : [],
  };

  // 주문 아이템 변환
  const orderItems: OrderItemSummary[] = bill.orderList.flatMap(order =>
    order.orderHisList.map(item => ({
      name: item.goodsNm,
      quantity: item.orderCnt,
      price: item.orderAmt,
    }))
  );

  // 주문 히스토리 변환 (여러 주문을 히스토리로 표현)
  const orderHistory: OrderHistory[] = bill.orderList.map(order => ({
    id: String(order.orderId),
    status: mapBillStatusToOrderStatus(order.orderSt),
    totalItems: order.orderHisList.reduce((sum, item) => sum + item.orderCnt, 0),
    orderTime: new Date(order.createdDt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    orderLocation: order.courseNm ? `${order.courseNm} ${order.holeNo}홀` : '-',
    items: order.orderHisList.map(item => ({
      name: item.goodsNm,
      quantity: item.orderCnt,
      price: item.orderAmt,
    })),
    specialRequest: order.orderReq || undefined,
  }));

  // 총 아이템 수
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // 주문 시간 (첫 번째 주문 기준)
  const orderTime = firstOrder
    ? new Date(firstOrder.createdDt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : '-';

  // 주문 위치 (첫 번째 주문 기준)
  const orderLocation = firstOrder && firstOrder.courseNm
    ? `${firstOrder.courseNm} ${firstOrder.holeNo}홀`
    : '-';

  // 특별 요청 (첫 번째 주문의 요청사항)
  const specialRequest = firstOrder?.orderReq || undefined;

  // 취소 사유
  const cancelReason = bill.orderList
    .filter(order => order.orderRea)
    .map(order => order.orderRea)
    .join(', ') || undefined;

  // 태그 (ERP 연동 여부)
  const tags = bill.isERP ? ['ERP'] : [];

  return {
    tableNumber: bill.tableNo || '-',
    customerInfo,
    orderItems,
    orderHistory,
    specialRequest,
    totalItems,
    orderTime,
    orderLocation,
    status,
    cancelReason,
    tags,
    totalAmount: bill.billAmt,
  };
};
