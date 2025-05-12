"use client";

import styles from "@/styles/pages/monitoring/monitoring.module.scss";
import FloatingStandBy from "@/components/monitoring/FloatingStandBy";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getClub } from "@/api/main";
import CourseType from "@/types/Course.type";
import Menu from "@/components/Menu";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const Monitoring = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<number>(0);

  const { data: clubData } = useQuery({
    queryKey: ["clubData"],
    queryFn: () => getClub(),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["bookingData"],
    queryFn: () => getBooking(),
  });

  const waitingCartList = useMemo(() => {
    if (!clubData || !bookingData) return [];

    return clubData.courseList.map((course) => {
      const filteredBookings = bookingData.filter(
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
  }, [clubData, bookingData]);

  const scrollToSection = (courseId: number) => {
    if (typeof window === "undefined") return;
    const section = document.getElementById(`${courseId}`);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  if (!clubData || !bookingData) {
    return null;
  }

  return (
    <>
      <h1 className="blind">{t("monitoring.title")}</h1>
      <div className={styles["monitoring-container"]}>
        {clubData?.courseList.map((course: CourseType) => {
          return (
            <section
              className={styles["course-section"]}
              key={course.courseId}
              id={`${course.courseId}`}
            >
              <div className={styles["course-title"]}>
                <span
                  className={styles["course-color"]}
                  style={{ backgroundColor: `${course.courseCol}` }}
                ></span>
                <h2 className={styles["course-name"]}>LAKE</h2>
                <span className={styles["course-teams-state"]}>
                  {bookingData?.filter((data) => data?.courseId === course?.courseId).length}
                  {t("monitoring.teamsPlaying")}
                </span>
              </div>
              <div className={styles["hole-list-wrap"]}>
                <ul className={styles["hole-list"]}>
                  {course.holeList.map((hole) => {
                    const cartListByHoleId = bookingData
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
                          {hole.holeNo}H {hole.holePar}P
                        </div>
                        <div className={styles["hole-item-line"]}></div>

                        {cartListByHoleId?.map((cart, index) => {
                          const outCourse = clubData?.courseList.find(
                            (course) => course.courseId === cart.outCourseId,
                          );

                          return (
                            <div
                              className={`${styles[`hole-item-buggy`]} ${index % 2 === 0 ? styles["up"] : styles["down"]}`}
                              style={{ left: `${cart.progress + "%"}` }}
                              key={`cartByHole-${cart.bookingId}`}
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
                              {cart?.tags.length > 0 && (
                                <ul className={styles["tag-list"]}>
                                  {cart?.tags.map((cart, index) => {
                                    return (
                                      <li key={index} className={styles[`${cart}`]}>
                                        <span className="blind">{cart}</span>
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
        <Link href="/message" className={styles["message-button"]}>
          <span className="blind">{t("monitoring.sendMessage")}</span>
        </Link>
        <div className={styles["menu-wrap"]}>
          <Menu courseList={clubData?.courseList || []} />
          <FloatingStandBy waitingCartList={waitingCartList} />
        </div>
      </div>
    </>
  );
};

export default Monitoring;
