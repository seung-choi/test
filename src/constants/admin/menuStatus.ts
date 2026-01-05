export const MENU_STATUS = {
    ON_SALE: '판매',
    SUSPENDED: '중지',
    PENDING: '대기'
} as const;

export type MenuStatus = typeof MENU_STATUS[keyof typeof MENU_STATUS];

export const MENU_STATUS_OPTIONS: MenuStatus[] = [
    MENU_STATUS.ON_SALE,
    MENU_STATUS.SUSPENDED,
    MENU_STATUS.PENDING
];

export const MENU_STATUS_STYLES: Record<MenuStatus, string> = {
    [MENU_STATUS.ON_SALE]: 'onSale',
    [MENU_STATUS.SUSPENDED]: 'suspended',
    [MENU_STATUS.PENDING]: 'pending'
};
