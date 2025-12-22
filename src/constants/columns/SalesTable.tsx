import {TableColumn} from "@/components/common/Table";
import {
    renderCustomers,
    renderDate,
    renderPrice,
    renderText
} from "@/utils/tableRenderers";

export const getSalesTableColumns = (): TableColumn[] => [
    {
        key: 'orderDate',
        label: '주문일자',
        width: '10%',
        sortable: true,
        render: renderDate,
    },
    {
        key: 'tO',
        label: '티오프',
        width: '9%',
        sortable: false,
        render: renderText,
    },
    {
        key: 'caddyName',
        label: '캐디명',
        width: '8%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'customerNames',
        label: '내장객(단체명)',
        width: '18%',
        sortable: true,
        render: renderCustomers,
    },
    {
        key: 'totalMenuCount',
        label: '총 메뉴 수',
        width: '8%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'orderDetails',
        label: '주문 메뉴 내역',
        width: '19%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'totalAmount',
        label: '총 주문금액',
        width: '10%',
        sortable: true,
        render: renderPrice,
    },
    {
        key: 'status',
        label: '최종 상태',
        width: '10%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'cancelReason',
        label: '취소 사유',
        width: '10%',
        sortable: true,
        render: renderText,
    },
];