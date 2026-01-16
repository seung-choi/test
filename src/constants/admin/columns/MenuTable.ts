import type { TableColumn } from '@/types';
import {
    renderChannelTags,
    renderCheckbox,
    renderEditButton,
    renderImage, renderPrice,
    renderStatusSelector,
    renderTags,
    renderText,
    renderDragHandle
} from "@/utils/admin/tableRenderers";
import type { GoodsStatus } from '@/types/api/goods.type';

interface MenuTableColumnsParams {
    selectedItems: string[];
    handleItemSelect: (itemId: string, checked: boolean) => void;
    handleStatusChange?: (itemId: string, status: GoodsStatus) => void;
    handleEdit?: (itemId: string) => void;
    isReorderMode?: boolean;
}

export const getMenuTableColumns = ({
                                        selectedItems,
                                        handleItemSelect,
                                        handleStatusChange = () => {},
                                        handleEdit = () => {},
                                        isReorderMode = false,
                                    }: MenuTableColumnsParams): TableColumn[] => [
    {
        key: 'select',
        label: '선택',
        width: '3.9%',
        style: isReorderMode ? { background: '#D9D9D9' } : undefined,
        render: isReorderMode ? renderDragHandle() : renderCheckbox(selectedItems, handleItemSelect),
    },
    {
        key: 'goodsImg',
        label: '이미지',
        width: '9%',
        render: renderImage,
    },
    {
        key: 'goodsErp',
        label: '코드',
        width: '6.7%',
        render: renderText,
    },
    {
        key: 'categoryNm',
        label: '분류',
        width: '6%',
        render: renderText,
    },
    {
        key: 'goodsNm',
        label: '메뉴명',
        width: '15%',
        render: renderText,
    },
    {
        key: 'goodsAmt',
        label: '금액',
        width: '8.4%',
        render: renderPrice,
    },
    {
        key: 'goodsTag',
        label: '태그',
        width: '10%',
        render: renderTags,
    },
    {
        key: 'goodsTm',
        label: '조리시간',
        width: '9%',
        render: renderText,
    },
    {
        key: 'goodsSt',
        label: '상태',
        width: '7.9%',
        render: renderStatusSelector(handleStatusChange),
    },
    {
        key: 'goodsCh',
        label: '채널',
        width: '7%',
        render: renderChannelTags,
    },
    {
        key: 'goodsOp',
        label: '유형',
        width: '7%',
        render: renderChannelTags,
    },
    {
        key: 'createdDt',
        label: '등록일',
        width: '10%',
        render: renderText,
    },
    {
        key: 'edit',
        label: '수정',
        width: '3.9%',
        render: renderEditButton(handleEdit),
    },
];
