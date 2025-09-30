"use client";

import styles from "@/styles/pages/monitoring/monitoring.module.scss";
import StandByPopup from "@/components/monitoring/StandByPopup";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getClub } from "@/api/main";
import CourseType from "@/types/Course.type";
import MenuPopup from "@/components/MenuPopup";
import BookingDetailPopup from "@/components/monitoring/BookingDetailPopup";
import SOSPopup from "@/components/monitoring/SOSPopup";
import StandByInfo from "@/components/monitoring/StandByInfo";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import transformBookingData from "@/utils/transformBookingData";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  standByPopupState,
  menuPopupOpenState,
  // holecupMenuPopupState,
  sseSOSPopupListState,
  // themeModeState,
} from "@/lib/recoil";
import HolecupMenuPopup from "@/components/HolcupMenuPopup";
import useSSE from "@/lib/useSSE";
import BookingType from "@/types/Booking.type";

// 태그 순서 정의
const tagOrder = [
  "FIRSTTEAMF1",
  "FIRSTTEAMF2",
  "FIRSTTEAMF3",
  "LASTTEAMF1",
  "LASTTEAMF2",
  "LASTTEAMF3",
  "VIP",
  "SELF",
  "TOWPERSONS",
  "THREEPERSONS",
  "FIVEPERSONS",
  "EDUCATION",
  "COMP",
  "GREENCHECK",
  "ADD9HOLES",
  "MARSHAL",
  "TOPDRESSING",
  "TIMEDELAY",
];

const Monitoring = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [selectedDetailData, setSelectedDetailData] = useState<BookingType | null>(null);
  const [detailPopupOpen, setDetailPopupOpen] = useState<boolean>(false);
  // const setHolecupMenuPopupOpen = useSetRecoilState(holecupMenuPopupState);
  const setStandByPopupOpen = useSetRecoilState(standByPopupState);
  const setMenuPopupOpen = useSetRecoilState(menuPopupOpenState);
  const sosPopupList = useRecoilValue(sseSOSPopupListState);
  // const themeMode = useRecoilValue(themeModeState);

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
    refetchInterval: 1000,
  });

  const refinedBookingData = useMemo(() => {
    if (!clubData || !bookingData) return [];
    return transformBookingData(bookingData, clubData);
  }, [bookingData, clubData]);

  const scrollToSection = (courseId: number) => {
    if (typeof window === "undefined") return;
    const section = document.getElementById(`${courseId}`);
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useSSE();

  if (!clubData || !bookingData) {
    return null;
  }

  return (
    <>
      <h1 className="blind">{t("monitoring.title")}</h1>
      <div className={styles["monitoring-container"]}>
        <div className={styles["monitoring-header"]}>
          <div className={styles["course-list-wrap"]}>
            <ul className={styles["course-list"]}>
              {clubData?.courseList.map((course: CourseType, index: number) => {
                return (
                  <li key={course.courseId}>
                    <button
                      type="button"
                      className={styles["course-name"]}
                      style={
                        activeMenu === index
                          ? { border: `2px solid ${course.courseCol}` }
                          : undefined
                      }
                      onClick={() => {
                        scrollToSection(course.courseId);
                        setActiveMenu(index);
                      }}
                    >
                      <span
                        className={styles["course-color"]}
                        style={{ backgroundColor: course.courseCol }}
                      ></span>
                      {course.courseNm}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles["monitoring-etc-menu"]}>
            {/* <Link
              href="/message"
              className={`${styles["monitoring-etc-menu-button"]} ${styles["message-button"]}`}
            >
              <img
                src={
                  themeMode === "dark"
                    ? "/assets/image/icon-message-white.svg"
                    : "/assets/image/icon-message-dark.svg"
                }
                alt="메세지"
              />
              <span className={styles["text"]}>메세지</span>
            </Link> */}
            <Link
              href="/search"
              className={`${styles["monitoring-etc-menu-button"]} ${styles["search-button"]}`}
            >
              <img src="/assets/image/icon-search.svg" alt="검색" />
              <span className={styles["text"]}>검색</span>
            </Link>
            <button
              type="button"
              className={`${styles["monitoring-etc-menu-button"]} ${styles["menu-button"]}`}
              onClick={() => setMenuPopupOpen(true)}
            >
              <img src="/assets/image/icon-menu-white.svg" alt="메뉴" />
              <span className={styles["text"]}>메뉴</span>
            </button>
          </div>
        </div>
        {clubData?.courseList.map((course: CourseType) => {
          const courseBookings =
            refinedBookingData?.filter(
              (booking: BookingType) => booking.courseId === course.courseId,
            ) || [];

          return (
            <section
              className={styles["course-section"]}
              key={course.courseId}
              id={`${course.courseId}`}
              style={{ border: `2px solid ${course.courseCol}` }}
            >
              <div className={styles["course-section-header"]}>
                <div className={styles["course-section-title"]}>
                  <span
                    className={styles["course-color"]}
                    style={{ backgroundColor: `${course.courseCol}` }}
                  ></span>
                  <h2 className={styles["course-name"]}>{course.courseNm}</h2>
                  <span className={styles["course-teams-state"]}>
                    {
                      refinedBookingData?.filter(
                        (data) =>
                          data?.courseId === course?.courseId &&
                          (data?.status === "OP" || data?.status === "IP"),
                      ).length
                    }
                    {t("monitoring.teamsPlaying")}
                  </span>
                </div>
                <div className={styles["course-standby-info-wrap"]}>
                  <StandByInfo
                    type="OW"
                    standbyList={courseBookings.filter((booking) => booking.status === "OW")}
                  />
                  <StandByInfo
                    type="IW"
                    standbyList={courseBookings.filter((booking) => booking.status === "IW")}
                  />
                  <button
                    type="button"
                    className={styles["standby-button"]}
                    onClick={() =>
                      setStandByPopupOpen({ isOpen: true, selectedCourseId: course.courseId })
                    }
                  >
                    <span className="blind">대기 인원 보기</span>
                  </button>
                </div>
              </div>
              <div className={styles["hole-list-wrap"]}>
                <ul className={styles["hole-list"]}>
                  {course.holeList.map((hole) => {
                    const cartListByHoleId = refinedBookingData
                      ?.filter(
                        (gps) =>
                          gps.courseId === course.courseId &&
                          gps.holeId === hole.holeId &&
                          (gps.status === "OP" || gps.status === "IP"),
                      )
                      .sort((a, b) => a.holeId - b.holeId || a.progress - b.progress);

                    return (
                      <li
                        className={styles["hole-item"]}
                        key={hole.holeId}
                        style={{
                          width: `calc(((100% / ${course.coursePar}) * ${hole.holePar}) - 18px)`,
                        }}
                      >
                        <div className={styles["hole-item-name"]}>
                          <strong>{hole.holeNo}H</strong> {hole.holePar}P
                        </div>
                        <div className={styles["hole-item-body"]}>
                          <div className={styles["hole-item-line"]}></div>

                          {cartListByHoleId?.map((cart) => {
                            const outCourse = clubData?.courseList.find(
                              (c) => c.courseId === cart.outCourseId,
                            );

                            // progress 차이로 겹침 판단 (25% 이내면 겹침으로 간주)
                            const overlappingCarts = cartListByHoleId.filter((c) => {
                              const progressDiff = Math.abs(
                                (cart.progress ?? 0) - (c.progress ?? 0),
                              );
                              return progressDiff <= 60;
                            });

                            const stackedIndex = overlappingCarts
                              .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
                              .findIndex((c) => c.bookingId === cart.bookingId);

                            return (
                              <div
                                data-selector="buggy-item"
                                key={`cartByHole-${cart.bookingId}`}
                                className={styles["buggy-wrapper"]}
                                style={{
                                  left: `${cart.progress}%`,
                                  cursor: "pointer",
                                  zIndex: Math.round(Number(cart.progress)),
                                }}
                              >
                                {cart.tags?.filter((tag) => tag !== "GROUP").length > 0 && (
                                  <ul
                                    className={styles.tagList}
                                    style={{
                                      bottom: `calc(100% + ${14 + stackedIndex * 28}px)`,
                                    }}
                                  >
                                    {cart.tags
                                      ?.filter((tag) => tagOrder.includes(tag))
                                      .sort((a, b) => tagOrder.indexOf(a) - tagOrder.indexOf(b))
                                      .map((tag, index) => {
                                        const level1Tags = [
                                          "FIRSTTEAMF1",
                                          "FIRSTTEAMF2",
                                          "FIRSTTEAMF3",
                                          "LASTTEAMF1",
                                          "LASTTEAMF2",
                                          "LASTTEAMF3",
                                          "VIP",
                                          "SELF",
                                        ];
                                        const shouldApplyLevel1 = level1Tags.includes(tag);
                                        return (
                                          <li
                                            key={index}
                                            className={`${styles[`${tag}`]} ${shouldApplyLevel1 ? styles.level1 : ""}`}
                                          >
                                            <span className="blind">{tag}</span>
                                          </li>
                                        );
                                      })}
                                    {/*{cart.delayTm !== null && (*/}
                                    {/*  <li className={styles.TIMEDELAY}>*/}
                                    {/*    <span className="blind">DELAY</span>*/}
                                    {/*  </li>*/}
                                    {/*)}*/}
                                  </ul>
                                )}
                                <strong
                                  className={styles.bookingNm}
                                  style={{
                                    bottom: `calc(100% + ${stackedIndex * 28}px)`,
                                  }}
                                  onClick={() => {
                                    setSelectedDetailData(cart);
                                    setDetailPopupOpen(true);
                                  }}
                                >
                                  {cart.bookingNm}
                                </strong>

                                {stackedIndex > 0 && (
                                  <div
                                    className={styles.dottedLine}
                                    style={{
                                      height: `${stackedIndex * 30}px`,
                                    }}
                                  ></div>
                                )}

                                {cart.bookingsNo !== null && (
                                  <div className={styles.tagGroup}>
                                    <span className="blind">단체팀 빨간 박스</span>
                                  </div>
                                )}
                                <div
                                  className={styles.buggy}
                                  style={{ backgroundColor: outCourse?.courseCol || "#FFDF68" }}
                                >
                                  <span className="blind">buggy</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
        {/* 플로팅 메뉴 */}
        {/* <div className={styles["floating-menu-wrap"]}>
          <button type="button" className={`${styles["floating-menu-button"]} ${styles["map-button"]}`}><span>관제</span></button>
          <button
            type="button"
            className={`${styles["floating-menu-button"]} ${styles["holecup-button"]}`}
            onClick={() => setHolecupMenuPopupOpen(true)}
          >
            <span>홀컵핀</span>
          </button>
          <button
            type="button"
            className={`${styles["floating-menu-button"]} ${styles["menu-button"]}`}
            onClick={() => setMenuPopupOpen(true)}
          >
            <span>메뉴</span>
          </button>
        </div> */}
      </div>
      <MenuPopup />
      <HolecupMenuPopup courseList={clubData?.courseList || []} />
      <StandByPopup
        clubData={clubData}
        bookingData={refinedBookingData}
        onBookingClick={(booking: BookingType) => {
          setSelectedDetailData(booking);
          setDetailPopupOpen(true);
          setStandByPopupOpen({
            isOpen: false,
            selectedCourseId: null,
          });
        }}
      />
      {detailPopupOpen && (
        <BookingDetailPopup
          onClose={() => setDetailPopupOpen(false)}
          booking={selectedDetailData}
        />
      )}
      {sosPopupList.length > 0 && <SOSPopup />}
    </>
  );
};

export default Monitoring;
