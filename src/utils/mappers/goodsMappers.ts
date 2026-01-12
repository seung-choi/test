import type { GoodsChannel, GoodsOption, GoodsStatus } from '@/api/goods';
import type { MenuStatus } from '@/constants/admin/menuStatus';

export const mapGoodsStatus = (status: GoodsStatus): MenuStatus => {
  switch (status) {
    case 'Y':
      return '판매';
    case 'S':
      return '품절';
    case 'N':
    default:
      return '중지';
  }
};

export const mapMenuStatusToGoods = (status?: MenuStatus): GoodsStatus => {
  switch (status) {
    case '판매':
      return 'Y';
    case '품절':
      return 'S';
    case '중지':
    default:
      return 'N';
  }
};

export const mapGoodsChannels = (channel: GoodsChannel): string[] => {
  switch (channel) {
    case 'COS':
      return ['코스'];
    case 'HUS':
      return ['매장'];
    case 'BOTH':
    default:
      return ['코스', '매장'];
  }
};

export const mapMenuChannelsToGoods = (channels?: string[]): GoodsChannel => {
  const list = channels ?? [];
  const hasCos = list.includes('코스');
  const hasHus = list.includes('매장');
  if (hasCos && hasHus) return 'BOTH';
  if (hasCos) return 'COS';
  if (hasHus) return 'HUS';
  return 'BOTH';
};

export const mapGoodsTypes = (option: GoodsOption): string[] => {
  switch (option) {
    case 'DINE':
      return ['매장'];
    case 'TAKE':
      return ['포장'];
    case 'BOTH':
    default:
      return ['매장', '포장'];
  }
};

export const mapMenuTypesToGoods = (types?: string[]): GoodsOption => {
  const list = types ?? [];
  const hasDine = list.includes('매장');
  const hasTake = list.includes('포장');
  if (hasDine && hasTake) return 'BOTH';
  if (hasDine) return 'DINE';
  if (hasTake) return 'TAKE';
  return 'BOTH';
};

export const mapGoodsTags = (tags: string): string[] => {
  if (!tags) return [];
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#/, ''));
};

export const mapMenuTagsToGoods = (tags?: string[]): string => {
  if (!tags || tags.length === 0) return '';
  return tags.map((tag) => `#${tag}`).join(',');
};
