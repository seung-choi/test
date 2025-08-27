"use client";

import styles from "@/styles/pages/monitoring/monitoring.module.scss";
import StandByPopup from "@/components/monitoring/StandByPopup";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getClub } from "@/api/main";
import CourseType from "@/types/Course.type";
import MenuPopup from "@/components/MenuPopup";
import SOSPopup from "@/components/monitoring/SOSPopup";
import StandByInfo from "@/components/monitoring/StandByInfo";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import transformBookingData from "@/utils/transformBookingData";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { standByPopupState, menuPopupOpenState, holecupMenuPopupState, sseSOSPopupListState, themeModeState } from "@/lib/recoil";
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
  const setHolecupMenuPopupOpen = useSetRecoilState(holecupMenuPopupState);
  const setStandByPopupOpen = useSetRecoilState(standByPopupState);
  const setMenuPopupOpen = useSetRecoilState(menuPopupOpenState);
  const sosPopupList = useRecoilValue(sseSOSPopupListState);
  const themeMode = useRecoilValue(themeModeState);

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

  const standbyCartList = useMemo(() => {
    if (!clubData || !refinedBookingData) return [];

    return clubData.courseList.map((course) => {
      const filteredBookings = refinedBookingData.filter(
        (booking) => booking.courseId === course.courseId,
      );

      const OPList = filteredBookings
        .filter((b) => b.status === "OW")
        .map((b) => ({
          bookingId: b.bookingId,
          bookingNm: b.bookingNm,
        }));

      const IPList = filteredBookings
        .filter((b) => b.status === "IW")
        .map((b) => ({
          bookingId: b.bookingId,
          bookingNm: b.bookingNm,
        }));

      return {
        courseId: course.courseId,
        courseNm: course.courseNm,
        OPList,
        IPList,
      };
    });
  }, [clubData, refinedBookingData]);

  const scrollToSection = (courseId: number) => {
    if (typeof window === "undefined") return;
    const section = document.getElementById(`${courseId}`);
    section?.scrollIntoView({ behavior: "smooth" });
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
                      style={activeMenu === index ? { border: `2px solid ${course.courseCol}` } : undefined}
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
            <Link href="/message" className={`${styles["monitoring-etc-menu-button"]} ${styles["message-button"]}`}>
              <img src={themeMode === "dark" ? "/assets/image/icon-message-white.svg" : "/assets/image/icon-message-dark.svg"} alt="메세지" />
              <span className={styles["text"]}>메세지</span>
            </Link>
            <Link href="/search"  className={`${styles["monitoring-etc-menu-button"]} ${styles["search-button"]}`}>
              <img src={themeMode === "dark" ? "/assets/image/icon-search.svg" : "/assets/image/icon-search-dark.svg"} alt="검색" />
              <span className={styles["text"]}>검색</span>
            </Link>
          </div>
        </div>
        {clubData?.courseList.map((course: CourseType) => {

          const courseBookings = refinedBookingData?.filter((booking: BookingType) => booking.courseId === course.courseId) || [];

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
                    {refinedBookingData?.filter((data) => 
                      data?.courseId === course?.courseId && 
                      (data?.status === "OP" || data?.status === "IP")
                    ).length}
                    {t("monitoring.teamsPlaying")}
                  </span>
                </div>
                <div className={styles["course-standby-info-wrap"]}>
                  <StandByInfo type="OW" standbyList={courseBookings.filter((booking) => booking.status === "OW")}/>
                  <StandByInfo type="IP" standbyList={courseBookings.filter((booking) => booking.status === "IP")}/>
                  <button type="button" className={styles["standby-button"]} onClick={() => setStandByPopupOpen({ isOpen: true, selectedCourseId: course.courseId })}>
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
                          width: `calc(((100% / ${course.coursePar}) * ${hole.holePar}) - 10px)`,
                        }}
                      >
                        <div className={styles["hole-item-name"]}>
                          <strong>{hole.holeNo}H</strong> {hole.holePar}P
                        </div>
                        <div className={styles["hole-item-line"]}></div>

                        {cartListByHoleId?.map((cart) => {
                          const outCourse = clubData?.courseList.find((c) => c.courseId === cart.outCourseId);

                          return (
                            <div
                              key={`cartByHole-${cart.bookingId}`}
                              className={styles["hole-item-buggy"]} 
                              style={{ left: `${cart.progress}%` }}
                            >
                              <div className={styles[`line-wrap`]}>
                                <span
                                  className={styles[`cir1`]}
                                  style={{ backgroundColor: `${outCourse?.courseCol ?? "#eee"}` }}
                                >
                                  <em
                                    className={styles[`in-cir1`]}
                                    style={{ backgroundColor: `${outCourse?.courseCol ?? "#eee"}` }}
                                  ></em>
                                </span>
                                <span
                                  className={styles[`line`]}
                                  style={{ borderColor: `${outCourse?.courseCol ?? "#eee"}` }}
                                ></span>
                              </div>
                              <strong className={styles["buggy-name"]}>
                                <span
                                  style={{ backgroundColor: `${outCourse?.courseCol ?? "#eee"}` }}
                                ></span>
                                {cart.bookingNm}
                              </strong>
                              {cart.tags?.filter((tag) => tag !== "GROUP" && tag !== "SELF").length > 0 && (
                                <ul className={styles["tag-list"]}>
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
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
        <div className={styles["floating-menu-wrap"]}>
           {/* <button type="button" className={`${styles["floating-menu-button"]} ${styles["map-button"]}`}><span>관제</span></button> */}
           <button type="button" className={`${styles["floating-menu-button"]} ${styles["holecup-button"]}`} onClick={() => setHolecupMenuPopupOpen(true)}><span>홀컵핀</span></button>
           <button type="button" className={`${styles["floating-menu-button"]} ${styles["menu-button"]}`} onClick={() => setMenuPopupOpen(true)}><span>메뉴</span></button>
        </div>
      </div>
      <MenuPopup />
      <HolecupMenuPopup courseList={clubData?.courseList || []} />
      <StandByPopup standbyCartList={standbyCartList} />
      {sosPopupList.length > 0 && <SOSPopup />}
    </>
  );
};

export default Monitoring;
