import type { GoodsChannel, GoodsOption } from '@/types/goods.type';

export const GOODS_CHANNEL = {
    COS: 'COS',
    HUS: 'HUS',
    BOTH: 'BOTH',
} as const;

export const GOODS_CHANNEL_LABELS: Record<Exclude<GoodsChannel, 'BOTH'>, string> = {
    COS: '코스',
    HUS: '매장',
};

export const CHANNEL_OPTIONS: Array<{ value: Exclude<GoodsChannel, 'BOTH'>; label: string }> = [
    { value: 'COS', label: '코스' },
    { value: 'HUS', label: '매장' },
];

export const GOODS_CHANNEL_MAP: Record<GoodsChannel, string[]> = {
    COS: ['코스'],
    HUS: ['매장'],
    BOTH: ['코스', '매장'],
};

export const GOODS_TYPE = {
    DINE: 'DINE',
    TAKE: 'TAKE',
    BOTH: 'BOTH',
} as const;

export const GOODS_TYPE_LABELS: Record<Exclude<GoodsOption, 'BOTH'>, string> = {
    DINE: '매장',
    TAKE: '포장',
};

export const TYPE_OPTIONS: Array<{ value: Exclude<GoodsOption, 'BOTH'>; label: string }> = [
    { value: 'DINE', label: '매장' },
    { value: 'TAKE', label: '포장' },
];

export const GOODS_TYPE_MAP: Record<GoodsOption, string[]> = {
    DINE: ['매장'],
    TAKE: ['포장'],
    BOTH: ['매장', '포장'],
};

export const getGoodsChannelFromLabels = (labels: string[]): GoodsChannel => {
    const hasCos = labels.includes('코스');
    const hasHus = labels.includes('매장');
    
    if (hasCos && hasHus) return 'BOTH';
    if (hasCos) return 'COS';
    if (hasHus) return 'HUS';
    return 'BOTH';
};

export const getGoodsTypeFromLabels = (labels: string[]): GoodsOption => {
    const hasDine = labels.includes('매장');
    const hasTake = labels.includes('포장');
    
    if (hasDine && hasTake) return 'BOTH';
    if (hasDine) return 'DINE';
    if (hasTake) return 'TAKE';
    return 'BOTH';
};
