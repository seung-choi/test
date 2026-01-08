import { useMemo } from 'react';
import { DEFAULT_TAG } from '@/constants/admin/tags/customerTags';

const normalizeImagePath = (path: string | null | undefined): string => {
  if (!path) return '';

  if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `/${path}`;
};

export const useDefaultTagImg = () => {
  const defaultTagImgMap = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_TAG.forEach((tag) => {
      if (tag.tagImg && tag.tagCd) {
        map.set(tag.tagCd, normalizeImagePath(tag.tagImg));
      }
    });
    return map;
  }, []);

  const getDefaultTagImg = (tagCd: string, fallbackImg?: string | null): string => {
    const defaultImg = defaultTagImgMap.get(tagCd);
    if (defaultImg) {
      return defaultImg;
    }
    return normalizeImagePath(fallbackImg);
  };

  return { getDefaultTagImg, defaultTagImgMap };
};
