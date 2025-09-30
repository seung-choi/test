"use client";

import styles from "@/styles/components/monitoring/StandByPopup.module.scss";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { standByPopupState } from "@/lib/recoil";

interface standbyCartListType {
  standbyCartList: {
    courseId: number;
    courseNm: string;
    OWList: {
      bookingId: number;
      bookingNm: string;
      bookingTm: string;
      bookingsNo: number | null;
      outCourseCol: string;
    }[];
    IWList: {
      bookingId: number;
      bookingNm: string;
      bookingTm: string;
      bookingsNo: number | null;
      outCourseCol: string;
    }[];
  }[];
}

const StandByPopup = ({ standbyCartList }: standbyCartListType) => {
  const { t } = useTranslation();
  const [standByPopup, setStandByPopup] = useRecoilState(standByPopupState);

  // 선택된 코스 ID를 초기 activeTab으로 설정
  const [activeTab, setActiveTab] = useState<number | null>(null);

  // standByPopupState가 변경될 때 activeTab 업데이트
  useEffect(() => {
    if (
      standByPopup.selectedCourseId &&
      standbyCartList.some((course) => course.courseId === standByPopup.selectedCourseId)
    ) {
      setActiveTab(standByPopup.selectedCourseId);
    } else if (standbyCartList.length > 0) {
      // 선택된 코스가 없거나 유효하지 않은 경우 첫 번째 코스 선택
      setActiveTab(standbyCartList[0]?.courseId || null);
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
                {standbyCartList.map((tab) => (
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
                    {t("monitoring.frontStandby")} <br />(
                    {standbyCartList.find((tab) => tab.courseId === activeTab)?.OWList.length || 0})
                  </div>
                  <div className={styles["standby-buggy"]}>
                    <ul className={`${styles["standby-buggy-list"]} scroll-hidden`}>
                      {standbyCartList
                        .find((tab) => tab.courseId === activeTab)
                        ?.OWList.map((item) => {
                          return (
                            <li key={item.bookingId} className={styles["standby-buggy-item"]}>
                              <div className={styles["standby-buggy-item-name"]}>
                                <div className={styles.waitingItemCart}>
                                  {item.bookingsNo !== null && (
                                    <div className={styles.tagGroup}></div>
                                  )}
                                  <div
                                    className={styles.outCourseCol}
                                    style={{ backgroundColor: item.outCourseCol || "#FFDF68" }}
                                  ></div>
                                </div>
                                <span className={styles["standby-buggy-item-name-text"]}>
                                  {item.bookingNm}
                                </span>
                              </div>
                              <span className={styles["standby-buggy-item-time"]}>
                                {item.bookingTm}
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
                    <br />(
                    {standbyCartList.find((tab) => tab.courseId === activeTab)?.IWList.length || 0})
                  </div>
                  <div className={styles["standby-buggy"]}>
                    <ul className={`${styles["standby-buggy-list"]} scroll-hidden`}>
                      {standbyCartList
                        .find((tab) => tab.courseId === activeTab)
                        ?.IWList.map((item) => {
                          return (
                            <li key={item.bookingId} className={styles["standby-buggy-item"]}>
                              <div className={styles["standby-buggy-item-name"]}>
                                <div className={styles.waitingItemCart}>
                                  {item.bookingsNo !== null && (
                                    <div className={styles.tagGroup}></div>
                                  )}
                                  <div
                                    className={styles.outCourseCol}
                                    style={{ backgroundColor: item.outCourseCol || "#FFDF68" }}
                                  ></div>
                                </div>
                                <span className={styles["standby-buggy-item-name-text"]}>
                                  {item.bookingNm}
                                </span>
                              </div>
                              <span className={styles["standby-buggy-item-time"]}>
                                {item.bookingTm}
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
