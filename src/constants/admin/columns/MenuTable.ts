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
import { MenuStatus } from '@/constants/admin/menuStatus';

interface MenuTableColumnsParams {
    selectedItems: string[];
    handleItemSelect: (itemId: string, checked: boolean) => void;
    handleStatusChange?: (itemId: string, status: MenuStatus) => void;
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
        key: 'image',
        label: '이미지',
        width: '9%',
        render: renderImage,
    },
    {
        key: 'code',
        label: '코드',
        width: '6.7%',
        render: renderText,
    },
    {
        key: 'category',
        label: '분류',
        width: '6%',
        render: renderText,
    },
    {
        key: 'name',
        label: '메뉴명',
        width: '15%',
        render: renderText,
    },
    {
        key: 'price',
        label: '금액',
        width: '8.4%',
        render: renderPrice,
    },
    {
        key: 'tags',
        label: '태그',
        width: '10%',
        render: renderTags,
    },
    {
        key: 'cookingTime',
        label: '조리시간',
        width: '9%',
        render: renderText,
    },
    {
        key: 'status',
        label: '상태',
        width: '7.9%',
        render: renderStatusSelector(handleStatusChange),
    },
    {
        key: 'channels',
        label: '채널',
        width: '7%',
        render: renderChannelTags,
    },
    {
        key: 'types',
        label: '유형',
        width: '7%',
        render: renderChannelTags,
    },
    {
        key: 'registerDate',
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
