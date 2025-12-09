
import { InfoCardData } from "@/types/orderInfoType";

export const mockAvailableTables = ['1번', '2번', '3번', '4번', '5번', '6번', '7번']

export const mockInfoCards: InfoCardData[] = [
  {
    id: '1',
    status: 'order',
    tableNumber: '3번',
    customerInfo: {
      name: '김지원',
      group: '행복회4기',
      time: '14:20',
      members: ['김주호(M)', '박성현(M)', '김서현(F)', '백성진(M)']
    },
    orderItems: [
      { name: '수육 한상 차림', quantity: 10, price: 12000 },
      { name: '반반피자', quantity: 3, price: 45000 },
      { name: '제육볶음', quantity: 2, price: 12000 },
      { name: '김치찌게', quantity: 10, price: 12000 }
    ],
    orderHistory: [
      {
        id: 'h1',
        status: 'accept',
        totalItems: 15,
        orderTime: '14:10',
        orderLocation: 'LAKE 7H',
        items: [
          { name: '삼겹살', quantity: 5, price: 18000 },
          { name: '소주', quantity: 8, price: 4000 },
          { name: '김치찌개', quantity: 2, price: 8000 }
        ],
        specialRequest: '고기 잘 구워주세요.'
      },
      {
        id: 'h2',
        status: 'accept',
        totalItems: 15,
        orderTime: '14:00',
        orderLocation: 'LAKE 7H',
        items: [
          { name: '갈비살', quantity: 3, price: 22000 },
          { name: '맥주', quantity: 6, price: 5000 },
          { name: '된장찌개', quantity: 4, price: 7000 },
          { name: '밥', quantity: 2, price: 2000 }
        ],
        specialRequest: '맥주 차갑게 주세요.'
      }
    ],
    specialRequest: '제육 덜 맵게 해주세요.',
    totalItems: 25,
    orderTime: '14:10',
    orderLocation: 'LAKE 7H',
    tags: ['vip', 'last_team_l1'],
    totalAmount: 250000
  },
  {
    id: '2',
    status: 'accept',
    tableNumber: '5번',
    customerInfo: {
      name: '이민호',
      group: '대학동창',
      time: '15:30',
      members: ['최수진(F)', '박민수(M)', '김영희(F)']
    },
    orderItems: [
      { name: '치킨', quantity: 2, price: 20000 },
      { name: '맥주', quantity: 4, price: 5000 }
    ],
    orderHistory: [
      {
        id: 'h3',
        status: 'accept',
        totalItems: 8,
        orderTime: '15:10',
        orderLocation: '테이블 5',
        items: [
          { name: '떡볶이', quantity: 3, price: 8000 },
          { name: '순대', quantity: 2, price: 10000 },
          { name: '콜라', quantity: 3, price: 3000 }
        ]
      }
    ],
    totalItems: 6,
    orderTime: '15:25',
    orderLocation: '테이블 5',
    tags: ['three_persons', 'comp'],
    totalAmount: 60000
  },
  {
    id: '3',
    status: 'complete',
    tableNumber: '6번',
    customerInfo: {
      name: '박서준',
      group: '회사동료',
      time: '13:45',
      members: ['김태현(M)', '이지영(F)', '최민재(M)', '정수연(F)']
    },
    orderItems: [
      { name: '갈비탕', quantity: 4, price: 15000 },
      { name: '냉면', quantity: 2, price: 8000 }
    ],
    orderHistory: [
      {
        id: 'h4',
        status: 'accept',
        totalItems: 12,
        orderTime: '13:30',
        orderLocation: 'LAKE 6H',
        items: [
          { name: '삼겹살', quantity: 4, price: 18000 },
          { name: '소주', quantity: 6, price: 4000 },
          { name: '상추', quantity: 2, price: 3000 }
        ],
        specialRequest: '고기 잘 구워주세요.'
      },
      {
        id: 'h5',
        status: 'accept',
        totalItems: 8,
        orderTime: '13:15',
        orderLocation: 'LAKE 6H',
        items: [
          { name: '김치찌개', quantity: 4, price: 8000 },
          { name: '밥', quantity: 4, price: 2000 }
        ]
      }
    ],
    totalItems: 6,
    orderTime: '13:40',
    orderLocation: 'LAKE 6H',
    tags: ['marshal', 'five_persons'],
    totalAmount: 76000
  },
  {
    id: '4',
    status: 'order',
    tableNumber: '3번',
    customerInfo: {
      name: '정유진',
      group: '가족모임',
      time: '12:00',
      members: ['정아버지(M)', '정어머니(F)', '정동생(M)']
    },
    orderItems: [
      { name: '수육 한상 차림', quantity: 10, price: 12000 },
      { name: '반반피자', quantity: 3, price: 45000 },
      { name: '제육볶음', quantity: 2, price: 12000 },
      { name: '김치찌게', quantity: 5, price: 12000 }
    ],
    specialRequest: '제육 덜 맵게 해주세요.',
    totalItems: 20,
    orderTime: '11:45',
    orderLocation: 'LAKE 7H',
    tags: ['vip', 'green_check', 'education'],
    totalAmount: 250000
  },
  {
    id: '5',
    status: 'cancel',
    tableNumber: '3번',
    customerInfo: {
      name: '김지원',
      group: '행복회4기',
      time: '14:20',
      members: ['김주호(M)', '박성현(M)', '김서현(F)', '백성진(M)']
    },
    orderItems: [
      { name: '수육 한상 차림', quantity: 10, price: 12000 },
      { name: '반반피자', quantity: 3, price: 45000 },
      { name: '제육볶음', quantity: 2, price: 12000 },
      { name: '김치찌게', quantity: 10, price: 12000 }
    ],
    specialRequest: '제육 덜 맵게 해주세요.',
    totalItems: 25,
    orderTime: '14:10',
    orderLocation: 'LAKE 7H',
    tags: ['delay', 'first_team_f1', 'add_9_holes'],
    cancelReason: '품절',
    totalAmount: 250000
  }
];