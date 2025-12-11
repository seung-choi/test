
import { InfoCardData } from "@/types/orderInfoType";

export const mockAvailableTables = ['1번', '2번', '3번', '4번', '5번', '6번', '7번', '8번', '9번', '10번', '11번', '12번', '13번', '14번']

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
        orderLocation: 'HILL 5H',
        items: [
          { name: '떡볶이', quantity: 3, price: 8000 },
          { name: '순대', quantity: 2, price: 10000 },
          { name: '콜라', quantity: 3, price: 3000 }
        ]
      }
    ],
    totalItems: 6,
    orderTime: '15:25',
    orderLocation: 'HILL 5H',
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
    orderLocation: 'HILL 7H',
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
  },
  {
    id: '6',
    status: 'order',
    tableNumber: '8번',
    customerInfo: {
      name: '윤서영',
      group: '요가동아리',
      time: '16:15',
      members: ['한지은(F)', '김미래(F)', '전소영(F)', '손예은(F)', '이영선(F)']
    },
    orderItems: [
      { name: '샐러드', quantity: 5, price: 15000 },
      { name: '연어스테이크', quantity: 3, price: 28000 },
      { name: '와인', quantity: 2, price: 45000 },
      { name: '스프', quantity: 5, price: 8000 }
    ],
    orderHistory: [
      {
        id: 'h6',
        status: 'accept',
        totalItems: 10,
        orderTime: '16:00',
        orderLocation: 'HILL 8H',
        items: [
          { name: '브런치세트', quantity: 5, price: 22000 },
          { name: '아메리카노', quantity: 5, price: 4500 }
        ]
      }
    ],
    specialRequest: '드레싱 따로 주세요.',
    totalItems: 15,
    orderTime: '16:10',
    orderLocation: 'HILL 8H',
    tags: ['vip', 'five_persons'],
    totalAmount: 177500
  },
  {
    id: '7',
    status: 'accept',
    tableNumber: '10번',
    customerInfo: {
      name: '박준호',
      group: '대학친구',
      time: '17:00',
      members: ['이창민(M)', '김동현(M)', '최현우(M)']
    },
    orderItems: [
      { name: '한우갈비', quantity: 4, price: 35000 },
      { name: '소주', quantity: 6, price: 4000 },
      { name: '된장찌개', quantity: 4, price: 7000 }
    ],
    orderHistory: [
      {
        id: 'h7',
        status: 'accept',
        totalItems: 8,
        orderTime: '16:45',
        orderLocation: 'LAKE 10H',
        items: [
          { name: '육회', quantity: 2, price: 25000 },
          { name: '맥주', quantity: 6, price: 5000 }
        ]
      },
      {
        id: 'h8',
        status: 'accept',
        totalItems: 12,
        orderTime: '16:30',
        orderLocation: 'LAKE 10H',
        items: [
          { name: '안주세트', quantity: 1, price: 40000 },
          { name: '위스키', quantity: 1, price: 80000 }
        ]
      }
    ],
    totalItems: 14,
    orderTime: '16:55',
    orderLocation: 'LAKE 10H',
    tags: ['marshal', 'three_persons'],
    totalAmount: 188000
  },
  {
    id: '8',
    status: 'complete',
    tableNumber: '12번',
    customerInfo: {
      name: '최은지',
      group: '직장동료',
      time: '18:30',
      members: ['김나연(F)', '박효린(F)', '서미나(F)', '조청아(F)']
    },
    orderItems: [
      { name: '파스타', quantity: 4, price: 18000 },
      { name: '리조또', quantity: 2, price: 22000 },
      { name: '샴페인', quantity: 1, price: 80000 }
    ],
    orderHistory: [
      {
        id: 'h9',
        status: 'complete',
        totalItems: 12,
        orderTime: '18:15',
        orderLocation: 'HILL 12H',
        items: [
          { name: '애피타이저', quantity: 5, price: 12000 },
          { name: '스파클링워터', quantity: 5, price: 3000 },
          { name: '빵', quantity: 2, price: 5000 }
        ]
      }
    ],
    specialRequest: '음식 예쁘게 플레이팅해주세요.',
    totalItems: 7,
    orderTime: '18:25',
    orderLocation: 'HILL 12H',
    tags: ['comp', 'green_check'],
    totalAmount: 186000
  },
  {
    id: '9',
    status: 'order',
    tableNumber: '1번',
    customerInfo: {
      name: '정우현',
      group: '회사임원',
      time: '19:45',
      members: ['조인성(M)', '송강민(M)', '이병철(M)', '김윤호(M)']
    },
    orderItems: [
      { name: '회덮밥', quantity: 6, price: 25000 },
      { name: '매운탕', quantity: 2, price: 35000 },
      { name: '소주', quantity: 10, price: 4000 },
      { name: '안주모둠', quantity: 3, price: 20000 }
    ],
    orderHistory: [
      {
        id: 'h10',
        status: 'accept',
        totalItems: 15,
        orderTime: '19:30',
        orderLocation: 'LAKE 1H',
        items: [
          { name: '회', quantity: 1, price: 60000 },
          { name: '맥주', quantity: 8, price: 5000 },
          { name: '김치', quantity: 3, price: 3000 },
          { name: '밑반찬', quantity: 3, price: 5000 }
        ]
      }
    ],
    specialRequest: '회 신선하게 준비해주세요.',
    totalItems: 21,
    orderTime: '19:40',
    orderLocation: 'LAKE 1H',
    tags: ['vip', 'marshal'],
    totalAmount: 290000
  },
  {
    id: '10',
    status: 'cancel',
    tableNumber: '14번',
    customerInfo: {
      name: '김태수',
      group: '동아리모임',
      time: '20:00',
      members: ['박준영(M)', '이진수(M)', '정민호(M)', '김정국(M)', '송태형(M)']
    },
    orderItems: [
      { name: '한정식', quantity: 7, price: 50000 },
      { name: '특선주류', quantity: 5, price: 30000 },
      { name: '디저트세트', quantity: 3, price: 25000 }
    ],
    orderHistory: [
      {
        id: 'h11',
        status: 'cancel',
        totalItems: 20,
        orderTime: '19:45',
        orderLocation: 'HILL 14H',
        items: [
          { name: '프리미엄코스', quantity: 7, price: 80000 },
          { name: '와인페어링', quantity: 7, price: 40000 },
          { name: '특별케이크', quantity: 1, price: 150000 }
        ],
        specialRequest: '개인 서빙 요청'
      }
    ],
    specialRequest: '개별 서빙 부탁드립니다.',
    totalItems: 15,
    orderTime: '19:55',
    orderLocation: 'HILL 14H',
    tags: ['delay', 'education'],
    cancelReason: '일정 변경',
    totalAmount: 485000
  },
  {
    id: '11',
    status: 'order',
    tableNumber: '2번',
    customerInfo: {
      name: '이승현',
      group: '골프모임',
      time: '09:30',
      members: ['박정민(M)', '김성훈(M)', '최영수(M)', '홍길동(M)']
    },
    orderItems: [
      { name: '모닝세트', quantity: 4, price: 18000 },
      { name: '아메리카노', quantity: 4, price: 4500 },
      { name: '과일주스', quantity: 2, price: 6000 }
    ],
    orderHistory: [
      {
        id: 'h12',
        status: 'accept',
        totalItems: 8,
        orderTime: '09:15',
        orderLocation: 'HILL 2H',
        items: [
          { name: '샌드위치', quantity: 4, price: 12000 },
          { name: '우유', quantity: 4, price: 3000 }
        ]
      }
    ],
    specialRequest: '커피 진하게 해주세요.',
    totalItems: 10,
    orderTime: '09:25',
    orderLocation: 'HILL 2H',
    tags: ['first_team_f1', 'education'],
    totalAmount: 90000
  },
  {
    id: '12',
    status: 'accept',
    tableNumber: '4번',
    customerInfo: {
      name: '박미영',
      group: '주부모임',
      time: '11:00',
      members: ['김순희(F)', '이현숙(F)', '정미란(F)']
    },
    orderItems: [
      { name: '런치세트', quantity: 4, price: 25000 },
      { name: '녹차', quantity: 4, price: 3500 },
      { name: '디저트', quantity: 2, price: 15000 }
    ],
    orderHistory: [
      {
        id: 'h13',
        status: 'accept',
        totalItems: 6,
        orderTime: '10:45',
        orderLocation: 'LAKE 4H',
        items: [
          { name: '샐러드', quantity: 3, price: 12000 },
          { name: '스프', quantity: 3, price: 8000 }
        ]
      }
    ],
    totalItems: 10,
    orderTime: '10:55',
    orderLocation: 'LAKE 4H',
    tags: ['three_persons', 'comp'],
    totalAmount: 114000
  },
  {
    id: '13',
    status: 'complete',
    tableNumber: '7번',
    customerInfo: {
      name: '조현우',
      group: '학회모임',
      time: '16:45',
      members: ['신동현(M)', '이재석(M)', '강호준(M)', '이경호(M)']
    },
    orderItems: [
      { name: '회식세트', quantity: 6, price: 35000 },
      { name: '맥주', quantity: 12, price: 5000 },
      { name: '안주모둠', quantity: 3, price: 20000 }
    ],
    orderHistory: [
      {
        id: 'h14',
        status: 'complete',
        totalItems: 15,
        orderTime: '16:30',
        orderLocation: 'HILL 7H',
        items: [
          { name: '삼겹살', quantity: 8, price: 18000 },
          { name: '소주', quantity: 7, price: 4000 }
        ]
      }
    ],
    specialRequest: '고기 잘 익혀주세요.',
    totalItems: 21,
    orderTime: '16:40',
    orderLocation: 'HILL 7H',
    tags: ['marshal', 'five_persons'],
    totalAmount: 238000
  },
  {
    id: '14',
    status: 'order',
    tableNumber: '9번',
    customerInfo: {
      name: '김소희',
      group: '독서모임',
      time: '14:15',
      members: ['이나영(F)', '박보영(F)', '김고은(F)', '전도연(F)']
    },
    orderItems: [
      { name: '브런치', quantity: 5, price: 22000 },
      { name: '허브티', quantity: 5, price: 5500 },
      { name: '케이크', quantity: 1, price: 35000 }
    ],
    orderHistory: [
      {
        id: 'h15',
        status: 'accept',
        totalItems: 10,
        orderTime: '14:00',
        orderLocation: 'LAKE 9H',
        items: [
          { name: '스콘', quantity: 5, price: 8000 },
          { name: '라떼', quantity: 5, price: 6000 }
        ]
      }
    ],
    specialRequest: '조용한 자리로 부탁해요.',
    totalItems: 11,
    orderTime: '14:10',
    orderLocation: 'LAKE 9H',
    tags: ['vip', 'five_persons'],
    totalAmount: 162500
  },
  {
    id: '15',
    status: 'cancel',
    tableNumber: '11번',
    customerInfo: {
      name: '한지민',
      group: '동호회',
      time: '18:20',
      members: ['정유미(F)', '김태리(F)', '박소담(F)', '천우희(F)', '김다미(F)']
    },
    orderItems: [
      { name: '이탈리안코스', quantity: 6, price: 45000 },
      { name: '와인', quantity: 3, price: 40000 },
      { name: '치즈플래터', quantity: 2, price: 30000 }
    ],
    orderHistory: [
      {
        id: 'h16',
        status: 'cancel',
        totalItems: 12,
        orderTime: '18:05',
        orderLocation: 'HILL 11H',
        items: [
          { name: '애피타이저', quantity: 6, price: 15000 },
          { name: '빵', quantity: 6, price: 5000 }
        ]
      }
    ],
    specialRequest: '와인 추천해주세요.',
    totalItems: 11,
    orderTime: '18:15',
    orderLocation: 'HILL 11H',
    tags: ['delay', 'green_check'],
    cancelReason: '교통체증',
    totalAmount: 390000
  },
  {
    id: '16',
    status: 'accept',
    tableNumber: '13번',
    customerInfo: {
      name: '신동현',
      group: '축구동호회',
      time: '12:30',
      members: ['박지국(M)', '안정환(M)', '홍명수(M)']
    },
    orderItems: [
      { name: '바베큐세트', quantity: 8, price: 30000 },
      { name: '맥주', quantity: 15, price: 5000 },
      { name: '냉면', quantity: 6, price: 8000 }
    ],
    orderHistory: [
      {
        id: 'h17',
        status: 'accept',
        totalItems: 18,
        orderTime: '12:15',
        orderLocation: 'LAKE 13H',
        items: [
          { name: '김치찌개', quantity: 6, price: 8000 },
          { name: '밥', quantity: 6, price: 2000 },
          { name: '반찬', quantity: 6, price: 3000 }
        ]
      }
    ],
    specialRequest: '맥주 시원하게 해주세요.',
    totalItems: 29,
    orderTime: '12:25',
    orderLocation: 'LAKE 13H',
    tags: ['marshal', 'add_9_holes'],
    totalAmount: 363000
  },
  {
    id: '17',
    status: 'complete',
    tableNumber: '14번',
    customerInfo: {
      name: '오세훈',
      group: '대학교수',
      time: '15:45',
      members: ['김영철(M)', '이순재(M)', '박인환(M)']
    },
    orderItems: [
      { name: '전통차', quantity: 4, price: 8000 },
      { name: '한과', quantity: 2, price: 25000 },
      { name: '떡', quantity: 1, price: 15000 }
    ],
    orderHistory: [
      {
        id: 'h18',
        status: 'complete',
        totalItems: 8,
        orderTime: '15:30',
        orderLocation: 'HILL 14H',
        items: [
          { name: '녹차', quantity: 4, price: 6000 },
          { name: '다식', quantity: 4, price: 12000 }
        ]
      }
    ],
    totalItems: 7,
    orderTime: '15:40',
    orderLocation: 'HILL 14H',
    tags: ['education', 'three_persons'],
    totalAmount: 80000
  },
  {
    id: '18',
    status: 'order',
    tableNumber: '1번',
    customerInfo: {
      name: '강민석',
      group: '창업동아리',
      time: '10:15',
      members: ['정우영(M)', '김도현(M)', '최지훈(M)', '윤성민(M)']
    },
    orderItems: [
      { name: '비즈니스런치', quantity: 7, price: 28000 },
      { name: '에스프레소', quantity: 7, price: 4000 },
      { name: '미팅룸사용료', quantity: 1, price: 50000 }
    ],
    orderHistory: [
      {
        id: 'h19',
        status: 'accept',
        totalItems: 14,
        orderTime: '10:00',
        orderLocation: 'LAKE 1H',
        items: [
          { name: '미네랄워터', quantity: 7, price: 2000 },
          { name: '노트북대여', quantity: 7, price: 5000 }
        ]
      }
    ],
    specialRequest: '조용한 환경 부탁해요.',
    totalItems: 15,
    orderTime: '10:10',
    orderLocation: 'LAKE 1H',
    tags: ['first_team_f1', 'education'],
    totalAmount: 280000
  },
  {
    id: '19',
    status: 'accept',
    tableNumber: '6번',
    customerInfo: {
      name: '윤정아',
      group: '미술동아리',
      time: '13:20',
      members: ['김수현(F)', '박신혜(F)', '전지현(F)', '송혜교(F)']
    },
    orderItems: [
      { name: '예술가세트', quantity: 5, price: 32000 },
      { name: '와인', quantity: 2, price: 35000 },
      { name: '과일플래터', quantity: 1, price: 25000 }
    ],
    orderHistory: [
      {
        id: 'h20',
        status: 'accept',
        totalItems: 10,
        orderTime: '13:05',
        orderLocation: 'HILL 6H',
        items: [
          { name: '치즈', quantity: 5, price: 15000 },
          { name: '크래커', quantity: 5, price: 8000 }
        ]
      }
    ],
    specialRequest: '창가 자리로 해주세요.',
    totalItems: 8,
    orderTime: '13:15',
    orderLocation: 'HILL 6H',
    tags: ['vip', 'green_check'],
    totalAmount: 185000
  },
  {
    id: '20',
    status: 'cancel',
    tableNumber: '8번',
    customerInfo: {
      name: '이재범',
      group: '동호회',
      time: '19:15',
      members: ['신승훈(M)', '김동윤(M)', '윤종민(M)', '이주호(M)']
    },
    orderItems: [
      { name: '뮤지션세트', quantity: 8, price: 40000 },
      { name: '위스키', quantity: 4, price: 60000 },
      { name: '안주모둠', quantity: 4, price: 25000 }
    ],
    orderHistory: [
      {
        id: 'h21',
        status: 'cancel',
        totalItems: 20,
        orderTime: '19:00',
        orderLocation: 'LAKE 8H',
        items: [
          { name: '하이볼', quantity: 8, price: 12000 },
          { name: '견과류', quantity: 4, price: 15000 },
          { name: '과일', quantity: 8, price: 8000 }
        ]
      }
    ],
    specialRequest: '음향시설 확인 부탁해요.',
    totalItems: 16,
    orderTime: '19:10',
    orderLocation: 'LAKE 8H',
    tags: ['delay', 'last_team_l1', 'add_9_holes'],
    cancelReason: '장비 문제',
    totalAmount: 560000
  }
];