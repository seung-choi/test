import { useMemo } from "react";
import { DEFAULT_TAG } from "@/constants/admin/tags/customerTags";

/**
 * 이미지 경로를 정규화하는 함수
 * Next.js 정적 빌드에서 public 폴더의 이미지를 올바르게 로드하기 위해 경로를 정규화
 */
const normalizeImagePath = (path: string | null | undefined): string => {
  if (!path) return "";

  // 이미 절대 경로로 시작하는 경우 (/, http://, https://)
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // 상대 경로인 경우 절대 경로로 변환
  return `/${path}`;
};

/**
 * DEFAULT_TAG의 tagCd를 키로 하는 tagImg Map을 생성하고,
 * tagCd에 해당하는 tagImg를 반환하는 함수를 제공하는 hook
 */
export const useDefaultTagImg = () => {
  // DEFAULT_TAG를 tagCd를 키로 하는 Map으로 변환 (성능 최적화)
  const defaultTagImgMap = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_TAG.forEach((tag) => {
      if (tag.tagImg && tag.tagCd) {
        // 경로를 정규화하여 저장
        map.set(tag.tagCd, normalizeImagePath(tag.tagImg));
      }
    });
    return map;
  }, []);

  /**
   * tagCd에 해당하는 tagImg를 반환
   * DEFAULT_TAG에 존재하면 DEFAULT_TAG의 tagImg를, 없으면 fallbackImg를 반환
   * 반환되는 경로는 정규화되어 있음
   */
  const getDefaultTagImg = (tagCd: string, fallbackImg?: string | null): string => {
    const defaultImg = defaultTagImgMap.get(tagCd);
    if (defaultImg) {
      return defaultImg;
    }
    // fallbackImg도 정규화
    return normalizeImagePath(fallbackImg);
  };

  return { getDefaultTagImg, defaultTagImgMap };
};
