import type { GoodsStatus } from '@/types/api/goods.type';

export const MENU_STATUS = {
    ON_SALE: '판매',
    SUSPENDED: '중지',
    SOLDOUT: '품절'
} as const;

export type MenuStatus = typeof MENU_STATUS[keyof typeof MENU_STATUS];

export const MENU_STATUS_OPTIONS: MenuStatus[] = [
    MENU_STATUS.ON_SALE,
    MENU_STATUS.SUSPENDED,
    MENU_STATUS.SOLDOUT
];

export const MENU_STATUS_STYLES: Record<MenuStatus, string> = {
    [MENU_STATUS.ON_SALE]: 'onSale',
    [MENU_STATUS.SUSPENDED]: 'suspended',
    [MENU_STATUS.SOLDOUT]: 'soldout'
};

export const GOODS_STATUS_MAP: Record<GoodsStatus, MenuStatus> = {
    'Y': MENU_STATUS.ON_SALE,
    'S': MENU_STATUS.SOLDOUT,
    'N': MENU_STATUS.SUSPENDED,
};

export const MENU_STATUS_TO_GOODS_MAP: Record<MenuStatus, GoodsStatus> = {
    [MENU_STATUS.ON_SALE]: 'Y',
    [MENU_STATUS.SOLDOUT]: 'S',
    [MENU_STATUS.SUSPENDED]: 'N',
};

export const GOODS_STATUS_OPTIONS: Array<{ value: GoodsStatus; label: MenuStatus }> = [
    { value: 'Y', label: MENU_STATUS.ON_SALE },
    { value: 'S', label: MENU_STATUS.SOLDOUT },
    { value: 'N', label: MENU_STATUS.SUSPENDED },
];

export const getMenuStatusStyle = (status: MenuStatus): string => {
    return MENU_STATUS_STYLES[status] || MENU_STATUS_STYLES[MENU_STATUS.SUSPENDED];
};
