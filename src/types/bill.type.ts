export type BillStatus = 'D' | 'C' | 'W';
export type BillOrderStatus = 'N' | 'A' | 'C' | 'D' | 'W';
export type OrderTake = 'D' | 'T';

export interface BookingTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface BillOrderHistory {
  orderNo: number;
  goodsId: number;
  goodsNm: string;
  orderOrd: number;
  orderCnt: number;
  orderAmt: number;
  orderTake: OrderTake;
  createdDt: string;
  modifiedDt: string;
}

export interface BillOrder {
  orderId: number;
  playerId: number;
  holeId: number;
  holeNo: number;
  courseId: number;
  courseNm: string;
  playerNm: string;
  playerErp: string;
  orderAmt: number;
  orderReq: string;
  orderRea: string;
  orderSt: BillOrderStatus;
  orderErp: string;
  createdDt: string;
  modifiedDt: string;
  orderHisList: BillOrderHistory[];
}

export interface Bill {
  isERP: boolean;
  billId: number;
  bookingId: number;
  tableId: number;
  tableNo: string;
  bookingNm: string;
  bookingTm: BookingTime;
  bookingsNm: string;
  bookingErp: string;
  playerList: string;
  billAmt: number;
  billSt: BillStatus;
  createdDt: string;
  modifiedDt: string;
  orderList: BillOrder[];
}

export interface GetBillResponse {
  totalCnt: number;
  doneCnt: number;
  cancelCnt: number;
  totalAmt: number;
  billList: Bill[];
}

export interface GetBillParams {
  fromDt?: string;
  toDt?: string;
  page?: number;
  size?: number;
}

export interface PostBillRequest {
  bookingId?: number;
  tableId: number;
  bookingNm: string;
  bookingTm?: BookingTime;
  bookingsNm?: string;
  bookingErp?: string;
  playerList?: string;
}

export interface PostBillResponse {
  billId: number;
}

export interface OrderHisRequest {
  goodsId: number;
  orderOrd: number;
  orderCnt: number;
  orderAmt: number;
  orderTake?: OrderTake;
}

export interface PostOrderRequest {
  billId?: number;
  playerId?: number;
  playerNm: string;
  playerErp: string;
  orderAmt: number;
  orderReq?: string;
  orderHisList: OrderHisRequest[];
}

export interface PutBillRequest {
  bookingErp?: string;
  playerNm?: string;
  playerErp?: string;
}

export interface DeleteBillRequest {
  orderRea: string;
}

export interface DeleteBillListRequest {
  orderRea?: string;
  orderIdList: number[];
}

export interface GetOrderHisResponse {
  orderNo: number;
  goodsNm: string;
  orderOrd: number;
  orderCnt: number;
  orderAmt: number;
  orderTake: OrderTake;
  createdDt: string;
  modifiedDt: string;
}

export interface GetOrderResponse {
  orderId: number;
  playerNm: string;
  orderAmt: number;
  orderReq: string;
  orderRea: string;
  orderSt: BillOrderStatus;
  createdDt: string;
  modifiedDt: string;
  orderHisList: GetOrderHisResponse[];
}

export interface ErpPlayerResponse {
  playerNm: string;
  playerErp: string;
}

export interface ErpBookingResponse {
  bookingNm: string;
  bookingDt: string;
  bookingTm: string;
  bookingErp: string;
  caddyNm: string;
  caddyErp: string;
  bookingsNm: string;
  playerList: ErpPlayerResponse[];
}
