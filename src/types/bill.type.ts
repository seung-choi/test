export type BillStatus = 'D' | 'N' | 'Y';
export type BillOrderStatus = 'N' | 'Y' | 'P' | 'R';
export type OrderTake = 'D' | 'N' | 'Y';

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
  playerId: number | null;
  holeId: number | null;
  holeNo: number | null;
  courseId: number | null;
  courseNm: string | null;
  playerNm: string | null;
  playerErp: string | null;
  orderAmt: number;
  orderReq: string | null;
  orderRea: string | null;
  orderSt: BillOrderStatus;
  orderErp: string | null;
  createdDt: string;
  modifiedDt: string;
  orderHisList: BillOrderHistory[];
}

export interface Bill {
  isERP: boolean;
  billId: number;
  bookingId: number | null;
  tableId: number | null;
  tableNo: string | null;
  bookingNm: string | null;
  bookingTm: string | null;
  bookingsNm: string | null;
  bookingErp: string | null;
  playerList: string | null;
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
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface PostBillRequest {
  bookingId?: number | null;
  tableId: number;
  bookingNm: string;
  bookingTm?: string | null;
  bookingsNm?: string | null;
  bookingErp?: string | null;
  playerList?: string | null;
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
