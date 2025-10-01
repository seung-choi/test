"use client";

import styles from "@/styles/components/HolecupMenuPopup.module.scss";
import CourseType from "@/types/Course.type";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { currentCourseState, currentHoleState, holecupMenuPopupState } from "@/lib/recoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

interface courseListProps {
  courseList: CourseType[];
}

const HolecupMenuPopup = ({ courseList }: courseListProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentCourse, setHolecupPageState] = useRecoilState(currentCourseState);
  const setCurrentHoleState = useSetRecoilState(currentHoleState);
  const [open, setOpen] = useRecoilState(holecupMenuPopupState);

  const path = usePathname();

  return (
    <div className={`${styles["menu-container"]} ${open ? styles["open"] : ""}`}>
      <div
        className={styles["dim"]}
        onClick={() => {
          setOpen(!open);
        }}
      ></div>
      <div className={styles["menu-inner"]}>
        <h2 className={styles["menu-title"]}>홀컵핀 설정</h2>
        <div className={styles["menu-list-wrap"]}>
          <ul className={`${styles["menu-list"]} scroll-hidden`}>
            {courseList?.map((course: CourseType) => {
              return (
                <li
                  className={`${styles["menu-item"]} ${path === "/holecup/" && currentCourse.id === course.courseId ? styles["active"] : ""}`}
                  key={course.courseId}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setHolecupPageState({
                        id: course?.courseId,
                        Nm: course?.courseNm,
                      });
                      router.push("/holecup");
                      setCurrentHoleState({
                        id: null,
                        no: null,
                      });
                      setOpen(!open);
                    }}
                  >
                    <span className={styles["sub-title"]}>{t("menu.holecupSubTitle")}</span>
                    <strong className={styles["title"]}>{course.courseNm}</strong>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className={styles["close-button"]}
          onClick={() => {
            setOpen(false);
          }}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default HolecupMenuPopup;
