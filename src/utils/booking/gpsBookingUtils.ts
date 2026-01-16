import type { GolferPositionData, GpsBookingType } from '@/types';

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

export const transformBookingToGolferPosition = (booking: GpsBookingType): GolferPositionData => {
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
