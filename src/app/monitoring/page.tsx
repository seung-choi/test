"use client";

import styles from "@/styles/pages/monitoring/monitoring.module.scss";
import StandByPopup from "@/components/monitoring/StandByPopup";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getClub, getMenuHis } from "@/api/main";
import CourseType from "@/types/Course.type";
import MenuPopup from "@/components/MenuPopup";
import BookingDetailPopup from "@/components/monitoring/BookingDetailPopup";
import SOSPopup from "@/components/monitoring/SOSPopup";
import StandByInfo from "@/components/monitoring/StandByInfo";
import MapMonitoring from "@/components/monitoring/MapMonitoring";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import transformBookingData from "@/utils/transformBookingData";
import { getTeamClassMapping } from "@/utils/getTeamClassMapping";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  menuPopupOpenState,
  menuState,
  monitoringViewState,
  sseSOSPopupListState,
  standByPopupState,
  teamClassMappingState,
  themeModeState,
} from "@/lib/recoil";
import HolecupMenuPopup from "@/components/HolcupMenuPopup";
import useSSE from "@/lib/useSSE";
import BookingType from "@/types/Booking.type";
import { LEVEL1_TAGS, TAG_ORDER } from "@/constants/tags";

const Monitoring = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const [selectedDetailData, setSelectedDetailData] = useState<BookingType | null>(null);
  const [detailPopupOpen, setDetailPopupOpen] = useState<boolean>(false);
  // const setHolecupMenuPopupOpen = useSetRecoilState(holecupMenuPopupState);
  const setStandByPopupOpen = useSetRecoilState(standByPopupState);
  const setMenuPopupOpen = useSetRecoilState(menuPopupOpenState);
  const sosPopupList = useRecoilValue(sseSOSPopupListState);
  const themeMode = useRecoilValue(themeModeState);
  const monitoringView = useRecoilValue(monitoringViewState);
  const menuCodes = useRecoilValue(menuState);
  const setMenuCodes = useSetRecoilState(menuState);
  // 팀 클래스 매핑 상태 관리
  const setTeamClassMapping = useSetRecoilState(teamClassMappingState);

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
    refetchInterval: 1000,
  });

  const { data: menu } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getMenuHis(),
  });

  const refinedBookingData = useMemo(() => {
    if (!clubData || !bookingData) return [];
    return transformBookingData(bookingData, clubData);
  }, [bookingData, clubData]);

  // Recoil state에서 팀 클래스 매핑 가져오기
  const teamClassMapping = useRecoilValue(teamClassMappingState);

  // refinedBookingData가 변경될 때마다 팀 클래스 매핑 업데이트
  useEffect(() => {
    if (refinedBookingData && refinedBookingData.length > 0) {
      const teamMapping = getTeamClassMapping(refinedBookingData);
      setTeamClassMapping(teamMapping);
    }
  }, [refinedBookingData, setTeamClassMapping]);

  const scrollToSection = (courseId: number) => {
    if (typeof window === "undefined") return;
    const section = document.getElementById(`${courseId}`);
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useSSE();

  // 메뉴 데이터가 로드되면 recoil에 저장
  useEffect(() => {
    if (menu) {
      setMenuCodes(menu);
    }
  }, [menu, setMenuCodes]);

  if (!clubData || !bookingData) {
    return null;
  }

  return (
    <>
      <h1 className="blind">{t("monitoring.title")}</h1>
      <div className={`${styles["monitoring-container"]} scroll-hidden`}>
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
            {menuCodes.includes("M_SSE") && (
              <Link
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
              </Link>
            )}
            {menuCodes.includes("M_DETAIL") && (
              <Link
                href="/search"
                className={`${styles["monitoring-etc-menu-button"]} ${styles["search-button"]}`}
              >
                <img
                  src={
                    themeMode === "dark"
                      ? "/assets/image/icon-search.svg"
                      : "/assets/image/icon-search-dark.svg"
                  }
                  alt="검색"
                />
                <span className={styles["text"]}>검색</span>
              </Link>
            )}
            <button
              type="button"
              className={`${styles["monitoring-etc-menu-button"]} ${styles["menu-button"]}`}
              onClick={() => setMenuPopupOpen(true)}
            >
              <img
                src={
                  themeMode === "dark"
                    ? "/assets/image/icon-menu-white.svg"
                    : "/assets/image/icon-menu-dark.svg"
                }
                alt="메뉴"
              />
              <span className={styles["text"]}>메뉴</span>
            </button>
          </div>
        </div>
        {monitoringView === "map" ? (
          <MapMonitoring
            clubData={clubData}
            booking={refinedBookingData}
            onBookingClick={(booking: BookingType) => {
              setSelectedDetailData(booking);
              setDetailPopupOpen(true);
            }}
            onStandByPopupOpen={() => setStandByPopupOpen({ isOpen: true, selectedCourseId: null })}
          />
        ) : (
          <>
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
                              // 251024 서서울 샷건 대회로 인해 바타입 임시 CW 허용.
                              (gps.status === "OP" || gps.status === "IP" || gps.status === "CW"),
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

                                // 전체 카트에서 겹침 그룹 찾기 (60% 이내면 겹침으로 간주)
                                const findOverlappingGroup = (carts: any[], targetCart: any) => {
                                  const group = [targetCart];

                                  for (const cart of carts) {
                                    if (cart.bookingId === targetCart.bookingId) continue;

                                    const isOverlapping = group.some((groupCart) => {
                                      const progressDiff = Math.abs(
                                        (cart.progress ?? 0) - (groupCart.progress ?? 0),
                                      );
                                      return progressDiff <= 60;
                                    });

                                    if (isOverlapping) {
                                      group.push(cart);
                                    }
                                  }

                                  return group;
                                };

                                const overlappingGroup = findOverlappingGroup(
                                  cartListByHoleId,
                                  cart,
                                );
                                const stackedIndex = overlappingGroup
                                  .sort((a, b) => {
                                    // progress가 다르면 높은 순으로 정렬
                                    const progressDiff = (b.progress ?? 0) - (a.progress ?? 0);
                                    if (progressDiff !== 0) return progressDiff;

                                    // progress가 같으면 원본 배열에서의 순서 유지 (앞에 있는 게 위로)
                                    const aIndex = cartListByHoleId.findIndex(
                                      (c) => c.bookingId === a.bookingId,
                                    );
                                    const bIndex = cartListByHoleId.findIndex(
                                      (c) => c.bookingId === b.bookingId,
                                    );
                                    return aIndex - bIndex;
                                  })
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
                                          ?.filter((tag) => TAG_ORDER.includes(tag))
                                          .sort(
                                            (a, b) => TAG_ORDER.indexOf(a) - TAG_ORDER.indexOf(b),
                                          )
                                          .map((tag, index) => {
                                            const shouldApplyLevel1 = LEVEL1_TAGS.includes(tag);
                                            return (
                                              <li
                                                key={index}
                                                className={`${styles[`${tag}`]} ${shouldApplyLevel1 ? styles.level1 : ""}`}
                                              >
                                                <span className="blind">{tag}</span>
                                              </li>
                                            );
                                          })}
                                        {/* TIMEDELAY 태그가 tags에 있거나 delayTm이 null이 아닐 경우 노출 */}
                                        {(cart.tags?.includes("TIMEDELAY") ||
                                          cart.delayTm !== null) && (
                                          <li className={styles.TIMEDELAY}>
                                            <span className="blind">TIMEDELAY</span>
                                          </li>
                                        )}
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
                                          height: `calc(${stackedIndex * 30}px - 2px)`,
                                        }}
                                      ></div>
                                    )}

                                    {cart.bookingsNo !== null && (
                                      <div
                                        className={`${styles.tagGroup} ${teamClassMapping.get(cart.bookingsNo.toString())}`}
                                      >
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
          </>
        )}

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

      <MenuPopup
        courseMap={
          clubData?.courseMapList.find((map) => map.mapCd === "COURSE" && map.mapType === "IMG") ||
          null
        }
      />
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
