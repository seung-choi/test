/**
 * 성별을 한글로 포맷팅하는 함수
 * @param gender - 성별 코드 (F: 여성, M: 남성, X: 없음)
 * @returns 포맷팅된 성별 문자열
 */
export const formatGender = (gender: string | null): string => {
  if (!gender) return "";

  switch (gender) {
    case "F":
      return "여성";
    case "M":
      return "남성";
    case "X":
      return "";
    default:
      return "";
  }
};
