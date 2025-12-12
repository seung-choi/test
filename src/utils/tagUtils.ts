import { DEFAULT_TAG } from '@/constants/tags';

export const getTagImage = (tagCd: string) => {
  const tag = DEFAULT_TAG.find(t => t.tagCd === tagCd);
  return tag?.tagImg || `/assets/image/tag/tag_${tagCd.toLowerCase()}.svg`;
};

export const getTagAltText = (tagCd: string) => {
  const tag = DEFAULT_TAG.find(t => t.tagCd === tagCd);
  return tag?.tagNm || tagCd;
};
