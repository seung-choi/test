// 문자열에서 모든 공백을 제거하는 유틸 함수
export const removeWhitespace = (str: string | null | undefined): string => {
  if (!str) return "";
  return str.replace(/\s/g, "");
};

// 문자열에서 앞뒤 공백만 제거하는 유틸 함수 (trim)
export const trimWhitespace = (str: string | null | undefined): string => {
  if (!str) return "";
  return str.trim();
};

// 문자열에서 연속된 공백을 하나로 만드는 유틸 함수
export const normalizeWhitespace = (str: string | null | undefined): string => {
  if (!str) return "";
  return str.replace(/\s+/g, " ").trim();
};
