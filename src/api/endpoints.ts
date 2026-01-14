export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    MENU_HISTORY: '/fnb/v1/menu/his',
  },

  // Shop
  SHOP: {
    INFO: '/fnb/v1/shop',
  },

  // Table
  TABLE: {
    LIST: '/fnb/v1/table',
    ERP: '/fnb/v1/table/erp',
    DETAIL: (tableId: number) => `/fnb/v1/table/${tableId}`,
    ORDER: '/fnb/v1/table',
  },

  // Goods
  GOODS: {
    LIST: '/fnb/v1/goods',
    ERP: '/fnb/v1/goods/erp',
    DETAIL: (goodsId: number) => `/fnb/v1/goods/${goodsId}`,
    STATUS: (goodsId: number, goodsSt: string) => `/fnb/v1/goods/status/${goodsId}/${goodsSt}`,
    ORDER: '/fnb/v1/goods/order',
  },

  // Category
  CATEGORY: {
    LIST: (categoryType: string) => `/fnb/v1/category/${categoryType}`,
    ERP: '/fnb/v1/category/erp',
  },

  // Bill (Sales)
  BILL: {
    LIST: '/fnb/v1/bill',
    CREATE: '/fnb/v1/bill',
    ORDER: '/fnb/v1/bill/order',
    DETAIL: (billId: number) => `/fnb/v1/bill/${billId}`,
    BY_STATUS: (orderSt: string) => `/fnb/v1/bill/${orderSt}`,
    ORDER_LIST: (billId: number) => `/fnb/v1/bill/order/${billId}`,
    ACCEPT_WITH_ERP: (billId: number, tableId: number) => `/fnb/v1/bill/${billId}/${tableId}`,
    ERP_LIST: '/fnb/v1/bill/erp',
  },

  // Subscribe (SSE)
  SUBSCRIBE: {
    PAGE: (clubId: string, pageId: string) => `/fnb/v1/subscribe/${clubId}/${pageId}`,
  },

  // GPS
  GPS: {
    BOOKING_LIST: '/monitoring/v1/booking',
    BOOKING_DETAIL: (bookingId: string) => `/monitoring/v1/booking/${bookingId}`,
  },

  // Event
  EVENT: {
    MSG_SEND: '/fnb/v1/event/msg/send',
    MSG_HISTORY: '/fnb/v1/event/msg/his',
    SSE_LIST: '/fnb/v1/event/SSE',
  },
} as const;
