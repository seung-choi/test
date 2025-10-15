import BookingType from "@/types/Booking.type";
import ClubType from "@/types/Club.type";

const transformBookingData = (rawData: BookingType[], clubData: ClubType): BookingType[] => {
  // bookingId 기준으로 그룹화
  const groupedByBookingId = groupByBookingId(rawData);

  const transformedData = Object.values(groupedByBookingId).map((group) => {
    // 그룹에 booking이 하나뿐이면 그대로 반환
    if (group.length === 1) return group[0];

    // 가장 빈도 높은 holeId 선택
    const targetHoleId = getTargetHoleId(group);
    const targetGroup = group.filter((g) => g.holeId === targetHoleId);

    // 그룹에서 기준 booking 선택
    const reference = targetGroup[0];

    // 해당 코스/홀에 대한 기준 마커 좌표 조회
    const markerCoordinates = getMarkerCoordinates(clubData, reference.courseId, reference.holeId);

    // 기준 마커와 booking 좌표 간 거리 계산
    const distance = (x: number | null | undefined, y: number | null | undefined): number => {
      if (x == null || y == null || markerCoordinates == null) return -1;
      return Math.hypot(x - markerCoordinates.x, y - markerCoordinates.y);
    };

    // 기준 마커로부터 가장 멀리 떨어진 booking 선택
    return targetGroup.reduce((max, cur) => {
      const curDist = distance(cur.x, cur.y);
      const maxDist = distance(max.x, max.y);
      return curDist > maxDist ? cur : max;
    }, reference);
  });
  // bookingTm 기준으로 오름차순 정렬 (이른 시간부터)
  return transformedData.sort((a, b) => {
    const timeA = a.bookingTm || "";
    const timeB = b.bookingTm || "";
    return timeA.localeCompare(timeB);
  });
};

// bookingId를 기준으로 Booking들을 그룹화
const groupByBookingId = (bookings: BookingType[]): Record<number, BookingType[]> => {
  return bookings.reduce(
    (acc, booking) => {
      if (!acc[booking.bookingId]) acc[booking.bookingId] = [];
      acc[booking.bookingId].push(booking);
      return acc;
    },
    {} as Record<number, BookingType[]>,
  );
};

// 그룹 내에서 가장 자주 등장하는 holeId 선택 (동일한 빈도일 경우 더 큰 값 우선)
const getTargetHoleId = (group: BookingType[]): number => {
  const holeIdCount = group.reduce(
    (acc, booking) => {
      if (booking.holeId != null) acc[booking.holeId] = (acc[booking.holeId] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  const holeIds = Object.keys(holeIdCount).map(Number);
  if (holeIds.length === 1) return holeIds[0];

  const maxCount = Math.max(...Object.values(holeIdCount));
  const candidates = holeIds.filter((hid) => holeIdCount[hid] === maxCount);
  return Math.max(...candidates);
};

// 지정된 코스와 홀에 해당하는 기준 마커 좌표 반환
const getMarkerCoordinates = (
  clubData: ClubType,
  courseId: number,
  holeId: number,
): { x: number; y: number } | null => {
  const course = clubData.courseList.find((c) => c.courseId === courseId);
  const hole = course?.holeList.find((h) => h.holeId === holeId);
  const marker = hole?.mapList.find(
    (m) => m.mapMode === clubData.clubMode && m.mapCd === "MARKER_BLACK_TEE" && m.mapType === "DOM",
  );

  if (marker?.mapX && marker?.mapY) {
    return {
      x: parseFloat(marker.mapX),
      y: parseFloat(marker.mapY),
    };
  }

  return null;
};

export default transformBookingData;
