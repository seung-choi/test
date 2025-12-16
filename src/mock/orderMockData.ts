import {OrderRecord} from "@/types/admin/setting.types";

export const mockOrderRecords: OrderRecord[] = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    orderDate: '2025-12-25T11:24:12',
    tO: '11:24',
    caddyName: '김은숙',
    customers: ['정철', '박지원', '허근영', '이지원'],
    groupName: '행복회',
    totalItems: i === 1 ? 2 : 10,
    menuDetails: i === 1 ? '잡채, 탕수육' : '갈비탕(2), 햄버거(1), 한우버거(3)',
    totalAmount: i === 1 || i === 2 ? 0 : 150000,
    status: i === 1 || i === 2 ? '취소' : '정산 완료',
    cancelReason: i === 1 ? '고객 요청' : i === 2 ? '품절' : undefined,
}));