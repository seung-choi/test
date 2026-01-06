import { useQuery } from "@tanstack/react-query";
import { getBookingList } from "@/api/monitoring";
import { GpsBookingType } from "@/types/booking.type";

export interface GolferPositionData {
  bookingId: number;
  bookingNm: string;
  bookingTm: string | null;
  holeNo: number | null;
  course: string;
  position: {
    left: string;
  };
  isGroup: boolean;
}

/**
 * 홀 내 위치를 기반으로 골퍼 카드의 left 위치를 계산
 * x, y 좌표 또는 progress를 기반으로 0-100% 범위의 값을 반환
 */
const calculatePosition = (booking: GpsBookingType): string => {
  // progress가 있으면 사용 (0-100 범위)
  if (booking.progress !== null && booking.progress !== undefined) {
    return `${Math.min(Math.max(booking.progress, 0), 100)}%`;
  }

  // x 좌표가 있으면 사용 (간단한 계산 예시)
  if (booking.x !== null && booking.x !== undefined) {
    // x 좌표를 0-100% 범위로 정규화 (실제 구현 시 홀의 크기에 맞게 조정 필요)
    const normalized = Math.min(Math.max(booking.x / 10, 0), 100);
    return `${normalized}%`;
  }

  // 기본값
  return "50%";
};

/**
 * 코스명에서 LAKE 또는 HILL 추출
 */
const extractCourseType = (courseNm: string | null): string => {
  if (!courseNm) return "UNKNOWN";
  const upper = courseNm.toUpperCase();
  if (upper.includes("LAKE")) return "LAKE";
  if (upper.includes("HILL")) return "HILL";
  return courseNm;
};

/**
 * GpsBookingType을 GolferPositionData로 변환
 */
const transformBookingToGolferPosition = (booking: GpsBookingType): GolferPositionData => {
  return {
    bookingId: booking.bookingId,
    bookingNm: booking.bookingNm,
    bookingTm: booking.bookingTm,
    holeNo: booking.holeNo,
    course: extractCourseType(
      booking.status === "OP" || booking.status === "OW"
        ? booking.outCourseNm
        : booking.inCourseNm || booking.courseNm
    ),
    position: {
      left: calculatePosition(booking),
    },
    isGroup: booking.bookingsSt === "Y",
  };
};

/**
 * 예약 목록을 조회하는 React Query Hook
 * @param options - useQuery 옵션 (refetchInterval 등)
 */
export const useBookingList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["bookingList"],
    queryFn: getBookingList,
    // 기본 5초마다 자동 갱신 (실시간 위치 업데이트)
    refetchInterval: options?.refetchInterval ?? 5000,
    enabled: options?.enabled ?? true,
    // 에러 발생 시 재시도
    retry: 2,
    // 캐시 시간 설정
    staleTime: 3000,
  });
};

/**
 * 골퍼 위치 정보를 가져오는 Hook
 * HeaderBar에서 사용하기 쉽게 데이터를 변환하여 반환
 */
export const useGolferPositions = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useBookingList(options);

  const golferPositions: GolferPositionData[] =
    data?.map(transformBookingToGolferPosition) ?? [];

  return {
    golferPositions,
    isLoading,
    error,
    refetch,
  };
};
