"use client";

import styles from "@/styles/pages/monitoring/monitoring.module.scss";
import StandByPopup from "@/components/monitoring/StandByPopup";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getClub, getMenuHis, getTag } from "@/api/main";
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
import { useDefaultTagImg } from "@/hooks/useDefaultTagImg";
import HoleType from "@/types/Hole.type";

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

  // DEFAULT_TAG의 tagImg를 가져오는 hook
  const { getDefaultTagImg } = useDefaultTagImg();

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
    refetchInterval: 1800,
  });

  const { data: menu } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getMenuHis(),
  });

  const { data: tagData } = useQuery({
    queryKey: ["apiTag"],
    queryFn: () => getTag(),
  });

  const refinedBookingData = useMemo(() => {
    if (!clubData || !bookingData) return [];
    return transformBookingData(bookingData, clubData);
  }, [bookingData, clubData]);

  // Recoil state에서 팀 클래스 매핑 가져오기
  const teamClassMapping = useRecoilValue(teamClassMappingState);

  // tagData에서 tagSt가 'Y'인 것만 필터링
  const activeTagData = tagData?.filter((tag) => tag.tagSt === "Y") || [];

  // 홀 너비와 간격 계산 함수
  const getHoleWidth = (hole: HoleType) => {
    // holeWth는 이미 전체 holeList 기준으로 정규화되어 있음
    return `${hole.holeWth}%`;
  };

  const getHoleGap = (hole: HoleType, holeList: HoleType[]) => {
    // 마지막 홀은 gap이 없음
    const isLastHole = hole.holeNo === holeList[holeList.length - 1].holeNo;
    if (isLastHole) {
      return "0%";
    }
    // holeGap는 이미 전체 holeList 기준으로 정규화되어 있음
    return `${hole.holeGap}%`;
  };

  // 특정 홀의 시작 위치를 전체 홀 기준으로 계산 (퍼센트)
  const getHoleStartPosition = (targetHole: HoleType, holeList: HoleType[]) => {
    let startPosition = 0;
    for (const hole of holeList) {
      if (hole.holeId === targetHole.holeId) {
        break;
      }
      startPosition += hole.holeWth;
      // 마지막 홀이 아니면 gap 추가
      const isLastHole = hole.holeNo === holeList[holeList.length - 1].holeNo;
      if (!isLastHole) {
        startPosition += hole.holeGap;
      }
    }
    return startPosition;
  };

  // 카트의 progress를 전체 홀 기준으로 변환
  const getGlobalProgress = (cart: BookingType, holeList: HoleType[]) => {
    const hole = holeList.find((h) => h.holeId === cart.holeId);
    if (!hole) return 0;

    const holeStartPosition = getHoleStartPosition(hole, holeList);
    const progressInHole = cart.progress ?? 0;

    // progress가 100%이고 다음 홀이 있는 경우, 홀간 사이 가운데 지점에 위치
    if (progressInHole >= 100) {
      const currentHoleIndex = holeList.findIndex((h) => h.holeId === hole.holeId);
      const isLastHole = currentHoleIndex === holeList.length - 1;

      // 마지막 홀이 아니면 다음 홀의 gap 중간 지점에 위치
      if (!isLastHole) {
        const currentHoleEndPosition = holeStartPosition + hole.holeWth;
        const nextHoleGap = hole.holeGap;
        // 현재 홀의 끝 + 다음 홀 gap의 절반
        return currentHoleEndPosition + nextHoleGap / 2;
      } else {
        // 마지막 홀이면 현재 홀의 끝에 위치
        return holeStartPosition + hole.holeWth;
      }
    }

    // progress가 100%가 아니면 기존 로직대로 계산
    // 홀 내에서의 progress를 전체 홀 기준으로 변환
    const globalProgress = holeStartPosition + (hole.holeWth * progressInHole) / 100;
    return globalProgress;
  };

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
                    <div className={styles["hole-list"]}>
                      {course.holeList.map((hole) => {
                        return (
                          <div
                            className={styles["hole-item"]}
                            key={hole.holeId}
                            style={{
                              width: getHoleWidth(hole),
                              marginRight: getHoleGap(hole, course.holeList),
                            }}
                          >
                            <div className={styles["hole-item-name"]}>
                              <strong>{hole.holeNo}H</strong> {hole.holePar}P
                            </div>
                            <div className={styles["hole-item-body"]}>
                              <div className={styles["hole-item-line"]}></div>
                            </div>
                          </div>
                        );
                      })}
                      {/* 전체 홀 기준으로 모든 카트 렌더링 */}
                      {(() => {
                        // 카트 간 겹침 판단 기준 거리 (퍼센트)
                        const OVERLAP_THRESHOLD = 7;

                        // 전체 카트를 progress 순으로 정렬
                        const allPlayingCarts = courseBookings
                          .filter((gps) => gps.status === "OP" || gps.status === "IP")
                          .sort((a, b) => {
                            const progressDiff =
                              getGlobalProgress(a, course.holeList) -
                              getGlobalProgress(b, course.holeList);
                            if (progressDiff !== 0) return progressDiff;

                            // progress가 같으면 원본 배열에서의 순서 유지
                            const aIndex = courseBookings.findIndex(
                              (c) => c.bookingId === a.bookingId,
                            );
                            const bIndex = courseBookings.findIndex(
                              (c) => c.bookingId === b.bookingId,
                            );
                            return aIndex - bIndex;
                          });

                        // 겹치는 카트들을 그룹으로 묶기
                        const overlapGroups: number[][] = [];
                        const cartGroupMap = new Map<number, number>(); // cart index -> group index

                        allPlayingCarts.forEach((cart, index) => {
                          const globalProgress = getGlobalProgress(cart, course.holeList);
                          let foundGroup = -1;

                          // 기존 그룹 중 하나에 속하는지 확인
                          for (let i = 0; i < overlapGroups.length; i++) {
                            const group = overlapGroups[i];
                            // 그룹 내의 어떤 카트와도 기준 거리 이내인지 확인
                            const isInGroup = group.some((groupIndex) => {
                              const groupCartProgress = getGlobalProgress(
                                allPlayingCarts[groupIndex],
                                course.holeList,
                              );
                              return (
                                Math.abs(globalProgress - groupCartProgress) <= OVERLAP_THRESHOLD
                              );
                            });

                            if (isInGroup) {
                              foundGroup = i;
                              break;
                            }
                          }

                          if (foundGroup >= 0) {
                            // 기존 그룹에 추가
                            overlapGroups[foundGroup].push(index);
                            cartGroupMap.set(index, foundGroup);
                          } else {
                            // 앞뒤 카트와의 거리 확인 (기준 거리 이내면 겹침으로 간주)
                            const hasOverlap =
                              (index > 0 &&
                                Math.abs(
                                  globalProgress -
                                    getGlobalProgress(allPlayingCarts[index - 1], course.holeList),
                                ) <= OVERLAP_THRESHOLD) ||
                              (index < allPlayingCarts.length - 1 &&
                                Math.abs(
                                  globalProgress -
                                    getGlobalProgress(allPlayingCarts[index + 1], course.holeList),
                                ) <= OVERLAP_THRESHOLD);

                            if (hasOverlap) {
                              // 새 그룹 생성
                              const newGroupIndex = overlapGroups.length;
                              overlapGroups.push([index]);
                              cartGroupMap.set(index, newGroupIndex);
                            }
                          }
                        });

                        // 각 그룹 내에서 progress 순으로 정렬
                        overlapGroups.forEach((group) => {
                          group.sort((a, b) => {
                            const progressA = getGlobalProgress(
                              allPlayingCarts[a],
                              course.holeList,
                            );
                            const progressB = getGlobalProgress(
                              allPlayingCarts[b],
                              course.holeList,
                            );
                            return progressA - progressB;
                          });
                        });

                        return allPlayingCarts.map((cart, sortedIndex) => {
                          const outCourse = clubData?.courseList.find(
                            (c) => c.courseId === cart.outCourseId,
                          );
                          const globalProgress = getGlobalProgress(cart, course.holeList);

                          // 겹침 그룹에 속하는지 확인
                          let stackedIndex = 0;
                          const groupIndex = cartGroupMap.get(sortedIndex);
                          if (groupIndex !== undefined) {
                            // 그룹 내에서의 상대적 인덱스 찾기
                            const group = overlapGroups[groupIndex];
                            const groupLocalIndex = group.indexOf(sortedIndex);
                            // 0→1→2→1→0→1→2 패턴 적용
                            const pattern = groupLocalIndex % 4;
                            stackedIndex = pattern === 3 ? 1 : pattern;
                          }

                          return (
                            <div
                              data-selector="buggy-item"
                              key={`cartByHole-${cart.bookingId}`}
                              className={styles["buggy-wrapper"]}
                              style={{
                                left: `${globalProgress}%`,
                                cursor: "pointer",
                                zIndex: Math.round(globalProgress),
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
                                    ?.filter((tag) => {
                                      if (tag === "GROUP" || tag === "TIMEDELAY") return false;
                                      // tagSt가 'Y'인 태그만 필터링
                                      const tagInfo = activeTagData.find((t) => t.tagCd === tag);
                                      return tagInfo !== undefined;
                                    })
                                    .map((tag, index) => {
                                      // tagData에서 tagCd와 일치하는 태그 찾기
                                      const tagInfo = activeTagData.find((t) => t.tagCd === tag);
                                      // DEFAULT_TAG에 있으면 그것의 tagImg 사용, 없으면 tagData의 tagImg 사용
                                      const tagImgSrc = getDefaultTagImg(
                                        tag,
                                        tagInfo?.tagImg || "",
                                      );
                                      return (
                                        <li key={index} className={styles.tagItem}>
                                          <img src={tagImgSrc} alt={tag} width={12} height={12} />
                                          <span className="blind">{tag}</span>
                                        </li>
                                      );
                                    })}
                                  {(cart.delayTm !== null ||
                                    (cart.tags?.includes("TIMEDELAY") &&
                                      activeTagData.some((tag) => tag.tagCd === "TIMEDELAY"))) && (
                                    <li className={styles.tagItem}>
                                      <img
                                        src={getDefaultTagImg("TIMEDELAY")}
                                        alt="TIMEDELAY"
                                        width={12}
                                        height={12}
                                      />
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

                              {cart.bookingsNo !== null && cart.bookingsSt === "Y" && (
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
                        });
                      })()}
                    </div>
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
        tagData={tagData || []}
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
