"use client";

import styles from "@/styles/components/Menu.module.scss";
import {useState} from "react";
import CourseType from "@/types/Course.type";
import storage from "@/utils/storage";
import { useRouter } from "next/navigation";
import useAlertModal from "@/hooks/useAlertModal";
import { usePathname } from "next/navigation";
import {currentCourseState} from "@/lib/recoil";
import {useRecoilState} from "recoil";

interface courseListProps {
  courseList: CourseType[];
}

const Menu = ({ courseList }: courseListProps) => {
  const router = useRouter();
  const [currentCourse, setHolecupPageState] = useRecoilState(currentCourseState);

  const [open, setOpen] = useState(false);
  const { setAlertModalState } = useAlertModal();
  const path = usePathname();



  const handleLogout = () => {
    setAlertModalState(() => ({
      isShow: true,
      desc: "로그아웃 하시겠습니까?",
      okBtnLabel: "확인",
      okCallback: () => {
        storage.session.clear();
        router.push("/login");
      },
    }));
  };

  return (
    <div className={`${styles["menu-container"]} ${open ? styles["open"] : ""}`}>
      <div
        className={styles["dim"]}
        onClick={() => {
          setOpen(!open);
        }}
      ></div>
      <div className={styles["menu-inner"]}>
        <div className={styles["user-info"]}>
          <div>
            <span className={styles["user-team"]}>{`${storage.session.get("groupNm")}`}</span>
            <p className={styles["user-name"]}>{`${storage.session.get("userNm")}`} 님</p>
          </div>
          <button type="button" className={styles["user-logout"]} onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
        <div className={styles["menu-list-wrap"]}>
          <ul className={styles["menu-list"]}>
            <li className={`${styles["menu-item"]} ${styles["monitoring"]} ${path === "/monitoring" ? styles["active"] : ""}`}>
              <button type="button" onClick={() => router.push("/monitoring")}>실시간 관제</button>
            </li>
            {courseList?.map((course: CourseType) => {
              return (
                <li className={`${styles["menu-item"]} ${path === "/holecup" && currentCourse.id === course.courseId ? styles["active"] : ""}`} key={course.courseId}>
                  <button  type="button"  onClick={() => {
                    setHolecupPageState({
                      id: course?.courseId,
                      Nm: course?.courseNm,
                    });
                    router.push("/holecup");
                  }}>
                    <span className={styles["sub-title"]}>홀컵핀</span>
                    <strong className={styles["title"]}>{course.courseNm}</strong>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className={styles["floating-button"]}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
