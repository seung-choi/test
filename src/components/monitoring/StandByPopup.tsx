"use client";

import styles from "@/styles/components/monitoring/StandByPopup.module.scss";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { menuState, standByPopupState } from "@/lib/recoil";
import ClubType from "@/types/Club.type";
import BookingType from "@/types/Booking.type";

interface StandByPopupProps {
  clubData: ClubType;
  bookingData: BookingType[];
  onBookingClick: (booking: BookingType) => void;
}

const StandByPopup = ({ clubData, bookingData, onBookingClick }: StandByPopupProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [standByPopup, setStandByPopup] = useRecoilState(standByPopupState);
  const menuCodes = useRecoilValue(menuState);

  // 선택된 코스의 예약 데이터를 메모이제이션
  const courseBookings = useMemo(() => {
    return bookingData?.filter((booking: BookingType) => booking.courseId === activeTab) || [];
  }, [bookingData, activeTab]);

  // 선택된 코스의 전반 리스트를 메모이제이션
  const OWList = useMemo(() => {
    return courseBookings.filter((b) => b.status === "OW");
  }, [courseBookings]);

  // 선택된 코스의 후반 리스트를 메모이제이션
  const IWList = useMemo(() => {
    return courseBookings.filter((b) => b.status === "IW");
  }, [courseBookings]);

  // standByPopupState가 변경될 때 activeTab 업데이트
  useEffect(() => {
    if (
      standByPopup.selectedCourseId &&
      clubData?.courseList.some((course) => course.courseId === standByPopup.selectedCourseId)
    ) {
      setActiveTab(standByPopup.selectedCourseId);
    } else if (clubData?.courseList.length > 0) {
      // 선택된 코스가 없거나 유효하지 않은 경우 첫 번째 코스 선택
      setActiveTab(clubData?.courseList[0]?.courseId || null);
    }
  }, [standByPopup.isOpen]);

  const closePopup = () => {
    setStandByPopup({
      isOpen: false,
      selectedCourseId: null,
    });
  };

  // activeTab이 설정되지 않은 경우 렌더링하지 않음
  if (!activeTab) {
    return null;
  }

  return (
    <div className={`${styles["standby-container"]} ${standByPopup.isOpen ? styles["open"] : ""}`}>
      <div className={styles["dim"]} onClick={closePopup}></div>
      <div className={styles["standby-inner"]}>
        {standByPopup.isOpen && (
          <>
            <div className={styles["tab-wrapper"]}>
              <ul className={styles["tabs"]}>
                {clubData?.courseList.map((tab) => (
                  <li
                    key={tab.courseId}
                    className={`${styles["tab"]} ${activeTab === tab.courseId ? styles["active"] : ""}`}
                    onClick={() => setActiveTab(tab.courseId)}
                  >
                    {tab.courseNm}
                  </li>
                ))}
              </ul>
              <div className={styles["tab-content"]}>
                <div className={styles["standby"]}>
                  <div className={styles["standby-title"]}>
                    {t("monitoring.frontStandby")} <br />({OWList.length})
                  </div>
                  <div className={styles["standby-buggy"]}>
                    <ul className={`${styles["standby-buggy-list"]} scroll-hidden`}>
                      {OWList.map((booking) => {
                        const outCourse = clubData?.courseList.find(
                          (c) => c.courseId === booking.outCourseId,
                        );
                        return (
                          <li key={booking.bookingId} className={styles["standby-buggy-item"]}>
                            <div className={styles["standby-buggy-item-name"]}>
                              <div className={styles.waitingItemCart}>
                                {booking.bookingsNo !== null && (
                                  <div className={styles.tagGroup}></div>
                                )}
                                <div
                                  className={styles.outCourseCol}
                                  style={{ backgroundColor: outCourse?.courseCol || "#FFDF68" }}
                                ></div>
                              </div>
                              <span
                                className={styles["standby-buggy-item-name-text"]}
                                onClick={() => {
                                  if (menuCodes.includes("M_DETAIL")) {
                                    onBookingClick?.(booking);
                                  }
                                }}
                              >
                                {booking.bookingNm}
                              </span>
                            </div>
                            <span className={styles["standby-buggy-item-time"]}>
                              {booking.bookingTm}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className={styles["standby"]}>
                  <div className={styles["standby-title"]}>
                    {t("monitoring.backStandby")}
                    <br />({IWList.length})
                  </div>
                  <div className={styles["standby-buggy"]}>
                    <ul className={`${styles["standby-buggy-list"]} scroll-hidden`}>
                      {IWList.map((booking) => {
                        const outCourse = clubData?.courseList.find(
                          (c) => c.courseId === booking.outCourseId,
                        );
                        return (
                          <li key={booking.bookingId} className={styles["standby-buggy-item"]}>
                            <div className={styles["standby-buggy-item-name"]}>
                              <div className={styles.waitingItemCart}>
                                {booking.bookingsNo !== null && (
                                  <div className={styles.tagGroup}></div>
                                )}
                                <div
                                  className={styles.outCourseCol}
                                  style={{ backgroundColor: outCourse?.courseCol || "#FFDF68" }}
                                ></div>
                              </div>
                              <span
                                className={styles["standby-buggy-item-name-text"]}
                                onClick={() => onBookingClick?.(booking)}
                              >
                                {booking.bookingNm}
                              </span>
                            </div>
                            <span className={styles["standby-buggy-item-time"]}>
                              {booking.bookingTm}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button className={styles["close-button"]} onClick={closePopup}>
              <span></span>
              <span></span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StandByPopup;
