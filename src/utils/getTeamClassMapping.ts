import BookingType from "@/types/Booking.type";

/**
 * bookingsNo별로 팀 클래스 매핑을 생성하는 유틸 함수
 * @param bookings - 예약 데이터 배열
 * @returns bookingsNo를 키로 하고 teamBox1~teamBox5를 값으로 하는 Map
 */
export const getTeamClassMapping = (bookings: BookingType[]): Map<string, string> => {
  const teamMapping = new Map<string, string>();
  const bookingsNos = Array.from(
    new Set(bookings.map((booking) => booking.bookingsNo).filter((no) => no !== null)),
  );

  bookingsNos.forEach((bookingsNo, index) => {
    const teamClass = `teamBox${(index % 5) + 1}`; // teamBox1~teamBox5 순환
    teamMapping.set(bookingsNo.toString(), teamClass);
  });

  return teamMapping;
};
