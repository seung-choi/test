import { useQuery } from '@tanstack/react-query';
import { getBookingList } from '@/api/monitoring';
import { GpsBookingType } from '@/types/booking.type';

export interface GolferPositionData {
  bookingId: number;
  bookingNm: string;
  bookingTm: string | null;
  holeNo: number | null;
  course: string;
  outCourse: string;
  position: {
    left: string;
  };
  isGroup: boolean;
  bookingsCol: string | null;
}

const calculatePosition = (booking: GpsBookingType): string => {
  if (booking.progress !== null && booking.progress !== undefined) {
    return `${Math.min(Math.max(booking.progress, 0), 100)}%`;
  }

  if (booking.x !== null && booking.x !== undefined) {
    const normalized = Math.min(Math.max(booking.x / 10, 0), 100);
    return `${normalized}%`;
  }

  return '50%';
};

const extractCourseType = (courseNm: string | null): string => {
  if (!courseNm) return 'UNKNOWN';
  const upper = courseNm.toUpperCase();
  if (upper.includes('LAKE')) return 'LAKE';
  if (upper.includes('HILL')) return 'HILL';
  return courseNm;
};

const transformBookingToGolferPosition = (booking: GpsBookingType): GolferPositionData => {
  const isInFrontNine = booking.status === 'OP' || booking.status === 'OW';
  const currentCourse = isInFrontNine
    ? booking.outCourseNm
    : booking.inCourseNm || booking.outCourseNm || booking.courseNm;

  return {
    bookingId: booking.bookingId,
    bookingNm: booking.bookingNm,
    bookingTm: booking.bookingTm,
    holeNo: booking.holeNo,
    course: extractCourseType(currentCourse),
    outCourse: extractCourseType(booking.outCourseNm),
    position: {
      left: calculatePosition(booking),
    },
    isGroup: booking.bookingsSt === 'Y' && !!booking.bookingsNo,
    bookingsCol: booking.bookingsCol,
  };
};

export const useBookingList = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['bookingList'],
    queryFn: getBookingList,
    refetchInterval: options?.refetchInterval ?? 5000,
    enabled: options?.enabled ?? true,
    retry: 2,
    staleTime: 3000,
  });
};

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
