import {TableColumn} from "@/components/common/Table";
import {
    renderChannelTags,
    renderImage, renderPrice,
    renderStatusSelector,
    renderTags,
    renderText
} from "@/utils/tableRenderers";

interface SalesTableColumnsParams {
    handleStatusChange?: (itemId: string, status: string) => void;
}

export const getSalesTableColumns = ({
                                         handleStatusChange = (itemId, status) => console.log('상태 변경:', itemId, status),
                                     }: SalesTableColumnsParams = {}): TableColumn[] => [
    {
        key: 'store',
        label: '매장',
        width: '9.1%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'image',
        label: '이미지',
        width: '10.8%',
        sortable: false,
        render: renderImage,
    },
    {
        key: 'code',
        label: '코드',
        width: '7.4%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'category',
        label: '분류',
        width: '7.2%',
        sortable: true,
    },
    {
        key: 'name',
        label: '메뉴명',
        width: '10.8%',
        sortable: true,
    },
    {
        key: 'price',
        label: '금액',
        width: '9.3%',
        sortable: true,
        render: renderPrice,
    },
    {
        key: 'tags',
        label: '태그',
        width: '7.8%',
        sortable: true,
        render: renderTags,
    },
    {
        key: 'cookingTime',
        label: '조리시간',
        width: '7.8%',
        sortable: true,
    },
    {
        key: 'status',
        label: '상태',
        width: '8.8%',
        sortable: true,
        render: renderStatusSelector(handleStatusChange),
    },
    {
        key: 'channels',
        label: '채널',
        width: '8.3%',
        sortable: true,
        render: renderChannelTags,
    },
    {
        key: 'types',
        label: '유형',
        width: '8.6%',
        sortable: true,
        render: renderChannelTags,
    },
    {
        key: 'registerDate',
        label: '등록일',
        width: '7.4%',
        sortable: true,
    },
];