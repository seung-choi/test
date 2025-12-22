import {TableColumn} from "@/components/common/Table";
import {
    renderChannelTags,
    renderCheckbox,
    renderEditButton,
    renderImage, renderPrice,
    renderStatusSelector,
    renderTags,
    renderText,
    renderDragHandle
} from "@/utils/tableRenderers";

interface MenuTableColumnsParams {
    selectedItems: string[];
    handleItemSelect: (itemId: string, checked: boolean) => void;
    handleStatusChange?: (itemId: string, status: string) => void;
    handleEdit?: (itemId: string) => void;
    isReorderMode?: boolean;
}

export const getMenuTableColumns = ({
                                        selectedItems,
                                        handleItemSelect,
                                        handleStatusChange = (itemId, status) => console.log('상태 변경:', itemId, status),
                                        handleEdit = (itemId) => console.log('수정:', itemId),
                                        isReorderMode = false,
                                    }: MenuTableColumnsParams): TableColumn[] => [
    {
        key: 'select',
        label: '선택',
        width: '3.5%',
        style: isReorderMode ? { background: '#D9D9D9' } : undefined,
        render: isReorderMode ? renderDragHandle() : renderCheckbox(selectedItems, handleItemSelect),
    },
    {
        key: 'store',
        label: '매장',
        width: '8.2%',
        sortable: true,
        render: renderText,
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
        sortable: true,
        render: renderText,
    },
    {
        key: 'category',
        label: '분류',
        width: '6%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'name',
        label: '메뉴명',
        width: '9%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'price',
        label: '금액',
        width: '8.4%',
        sortable: true,
        render: renderPrice,
    },
    {
        key: 'tags',
        label: '태그',
        width: '10%',
        sortable: true,
        render: renderTags,
    },
    {
        key: 'cookingTime',
        label: '조리시간',
        width: '8%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'status',
        label: '상태',
        width: '7.9%',
        sortable: true,
        render: renderStatusSelector(handleStatusChange),
    },
    {
        key: 'channels',
        label: '채널',
        width: '7%',
        sortable: true,
        render: renderChannelTags,
    },
    {
        key: 'types',
        label: '유형',
        width: '7%',
        sortable: true,
        render: renderChannelTags,
    },
    {
        key: 'registerDate',
        label: '등록일',
        width: '10%',
        sortable: true,
        render: renderText,
    },
    {
        key: 'edit',
        label: '수정',
        width: '3.5%',
        render: renderEditButton(handleEdit),
    },
];