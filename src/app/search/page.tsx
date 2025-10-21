"use client";

import styles from "@/styles/pages/search/search.module.scss";
import { getBooking, getClub } from "@/api/main";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SendMessage from "@/components/monitoring/SendMessage";
import { Input } from "@/components/Input";
import transformBookingData from "@/utils/transformBookingData";
import BookingDetail from "@/components/monitoring/BookingDetail";
import BookingType from "@/types/Booking.type";

const Search = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [searchType, setSearchType] = useState<"caddy" | "player">("caddy");
  const [searchName, setSearchName] = useState<string>("");
  // 선택된 booking data를 저장할 state 추가
  const [selectedBookingData, setSelectedBookingData] = useState<BookingType | null>(null);
  // SendMessage 컴포넌트로 전달할 groupedByCourse 데이터를 저장할 state 추가
  const [groupedByCourseData, setGroupedByCourseData] = useState<
    { courseId: number; bookingIdList: number[] }[]
  >([]);

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
  });

  const refinedBookingData = useMemo(() => {
    if (!clubData || !bookingData) return [];
    return transformBookingData(bookingData, clubData);
  }, [bookingData, clubData]);

  // 검색 결과 필터링
  const filteredData = useMemo(() => {
    if (!searchName.trim()) return [];

    //전반진행중(IP) 후반진행중(OP) 전반대기(OW) 후반대기(IW) 종료 대기(CW) 카운팅
    const participateBookings = refinedBookingData.filter(
      (booking) =>
        booking.status === "OP" ||
        booking.status === "IP" ||
        booking.status === "OW" ||
        booking.status === "IW" ||
        booking.status === "CW",
    );

    return participateBookings.filter((booking: BookingType) => {
      if (searchType === "caddy") {
        return (
          booking.caddyNm &&
          booking.caddyNm.trim() !== "" &&
          booking.caddyNm.toLowerCase().includes(searchName.toLowerCase())
        );
      } else {
        return (
          booking.playerList &&
          booking.playerList.length > 0 &&
          booking.playerList.some(
            (player) =>
              player.playerNm && player.playerNm.toLowerCase().includes(searchName.toLowerCase()),
          )
        );
      }
    });
  }, [refinedBookingData, searchType, searchName]);

  // 검색 결과가 있는지 확인
  const hasSearchResults = filteredData.length > 0;

  return (
    <>
      {step === 1 && (
        <div className={styles["search-container"]}>
          <div className={styles["head"]}>
            <button
              type="button"
              className={styles["head-arrow"]}
              onClick={() => router.push("/monitoring")}
            >
              <span className="blind">back</span>
            </button>
            <h1 className={styles["head-title"]}>검색하기</h1>
          </div>
          <div className={styles["content"]}>
            <div className={styles["search-inner"]}>
              <strong className={styles["search-desc"]}>
                검색할 이름을 <br />
                입력해주세요.
              </strong>
              <div className={styles["search-type"]}>
                <button
                  type="button"
                  className={`${styles["search-type-button"]} ${searchType === "caddy" ? styles["active"] : ""}`}
                  onClick={() => setSearchType("caddy")}
                >
                  캐디
                </button>
                <button
                  type="button"
                  className={`${styles["search-type-button"]} ${searchType === "player" ? styles["active"] : ""}`}
                  onClick={() => setSearchType("player")}
                >
                  내장객명
                </button>
              </div>
              <Input
                label="content"
                labelShow={false}
                id="searchName"
                name="searchName"
                placeholder={"텍스트를 입력하세요."}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onClear={() => setSearchName("")}
              />
            </div>

            {/* 검색 결과가 있을 때만 표시 */}
            {hasSearchResults && (
              <div className={styles["search-result-inner"]}>
                {filteredData.length > 1 && (
                  <span className={styles["search-result-desc"]}>
                    중복된 검색 결과입니다. 찾으시는 항목을 선택해주세요.
                  </span>
                )}
                <ul className={styles["search-result-list"]}>
                  {filteredData.map((booking: BookingType) => {
                    // 캐디 검색인 경우 캐디명, 내장객 검색인 경우 첫 번째 플레이어명 표시
                    const displayName =
                      searchType === "caddy"
                        ? booking.caddyNm
                        : booking.playerList?.[0]?.playerNm || "이름 없음";

                    return (
                      <li
                        key={`${booking.bookingId}-${booking.holeId}`}
                        className={styles["search-result-item"]}
                      >
                        <span className={styles["search-result-item-name"]}>{displayName}</span>
                        <span className={styles["search-result-item-teeOff"]}>
                          {booking.bookingTm}
                        </span>
                        <span className={styles["search-result-item-location"]}>
                          {booking.courseNm} {booking.holeNo}H
                        </span>
                        <button
                          type="button"
                          className={styles["search-result-item-detail-button"]}
                          onClick={() => {
                            setSelectedBookingData(booking); // 선택된 booking data 저장
                            setStep(2); // step 2로 이동
                          }}
                        >
                          선택
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* 검색어가 입력되었지만 결과가 없을 때 */}
            {searchName.trim() && !hasSearchResults && (
              <div className={styles["search-result-inner"]}>
                <span className={styles["search-empty-result"]}>검색 결과가 없습니다.</span>
              </div>
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <BookingDetail
          booking={selectedBookingData} // 선택된 booking data 전달
          onBack={() => setStep(1)}
          onSendMessage={() => {
            // booking data를 groupedByCourse 형식으로 변환
            if (selectedBookingData) {
              const groupedByCourse = [
                {
                  courseId: selectedBookingData.courseId,
                  bookingIdList: [selectedBookingData.bookingId],
                },
              ];
              // 변환된 데이터를 state에 저장
              setGroupedByCourseData(groupedByCourse);
              // step 3으로 이동
              setStep(3);
            }
          }}
        />
      )}
      {step === 3 && (
        <SendMessage
          groupedByCourse={groupedByCourseData} // 변환된 groupedByCourse 데이터 전달
          onBack={() => setStep(2)}
        />
      )}
    </>
  );
};

export default Search;
