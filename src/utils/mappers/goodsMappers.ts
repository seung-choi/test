import type { GoodsChannel, GoodsOption, GoodsStatus } from '@/api/goods';
import type { MenuStatus } from '@/constants/admin/menuStatus';
import { GOODS_STATUS_MAP, MENU_STATUS_TO_GOODS_MAP, MENU_STATUS } from '@/constants/admin/menuStatus';
import { GOODS_CHANNEL_MAP, GOODS_TYPE_MAP, getGoodsChannelFromLabels, getGoodsTypeFromLabels } from '@/constants/admin/goodsOptions';

export const mapGoodsStatus = (status: GoodsStatus): MenuStatus => {
  return GOODS_STATUS_MAP[status] || MENU_STATUS.SUSPENDED;
};

export const mapMenuStatusToGoods = (status?: MenuStatus): GoodsStatus => {
  if (!status) return 'N';
  return MENU_STATUS_TO_GOODS_MAP[status] || 'N';
};

export const mapGoodsChannels = (channel: GoodsChannel): string[] => {
  return GOODS_CHANNEL_MAP[channel];
};

export const mapMenuChannelsToGoods = (channels?: string[]): GoodsChannel => {
  return getGoodsChannelFromLabels(channels ?? []);
};

export const mapGoodsTypes = (option: GoodsOption): string[] => {
  return GOODS_TYPE_MAP[option];
};

export const mapMenuTypesToGoods = (types?: string[]): GoodsOption => {
  return getGoodsTypeFromLabels(types ?? []);
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
