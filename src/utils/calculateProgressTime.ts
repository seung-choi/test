/**
 * 시작 시간과 종료 시간을 받아서 진행 시간을 계산하는 함수
 * @param startTime - 시작 시간 (HH:MM 형식)
 * @param endTime - 종료 시간 (HH:MM 형식), null인 경우 현재 시간 사용
 * @returns 진행 시간 (HH:MM 형식) 또는 "-" (시작 시간이 null인 경우)
 */
export const calculateProgressTime = (startTime: string | null, endTime: string | null): string => {
  // 시작 시간이 null이면 "-" 반환
  if (!startTime) return "-";

  // 오늘 날짜를 기준으로 시작 시간 설정
  const today = new Date();
  const start = new Date(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T${startTime}`,
  );

  let end: Date;

  if (endTime) {
    // 종료 시간이 있으면 오늘 날짜 기준으로 설정
    end = new Date(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T${endTime}`,
    );
  } else {
    // 종료 시간이 없으면 현재 시간 사용
    end = new Date();
  }

  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
