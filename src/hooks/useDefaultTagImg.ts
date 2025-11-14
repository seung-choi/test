import { useMemo } from "react";
import { DEFAULT_TAG } from "@/constants/tags";

/**
 * DEFAULT_TAG의 tagCd를 키로 하는 tagImg Map을 생성하고,
 * tagCd에 해당하는 tagImg를 반환하는 함수를 제공하는 hook
 */
export const useDefaultTagImg = () => {
  // DEFAULT_TAG를 tagCd를 키로 하는 Map으로 변환 (성능 최적화)
  const defaultTagImgMap = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_TAG.forEach((tag) => {
      if (tag.tagImg) {
        map.set(tag.tagCd, tag.tagImg);
      }
    });
    return map;
  }, []);

  /**
   * tagCd에 해당하는 tagImg를 반환
   * DEFAULT_TAG에 존재하면 DEFAULT_TAG의 tagImg를, 없으면 fallbackImg를 반환
   */
  const getDefaultTagImg = (tagCd: string, fallbackImg?: string | null): string => {
    return defaultTagImgMap.get(tagCd) || fallbackImg || "";
  };

  return { getDefaultTagImg, defaultTagImgMap };
};
