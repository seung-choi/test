"use client";

import styles from "@/styles/components/monitoring/StandByPopup.module.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { standByPopupState } from "@/lib/recoil";

interface waitingCartListType {
  waitingCartList: {
    courseId: number;
    courseNm: string;
    OPList: {
      bookingId: number;
      bookingNm: string;
    }[];
    IPList: {
      bookingId: number;
      bookingNm: string;
    }[];
  }[];
}

const StandByPopup = ({ waitingCartList }: waitingCartListType) => {
  const { t } = useTranslation();
  const [standByPopup, setStandByPopup] = useRecoilState(standByPopupState);

  const [activeTab, setActiveTab] = useState(waitingCartList[0]?.courseId);

  return (
    <div className={`${styles["standby-container"]} ${standByPopup ? styles["open"] : ""}`}>
      <div
        className={styles["dim"]}
        onClick={() => {
          setStandByPopup(false);
        }}
      ></div>
      <div className={styles["standby-inner"]}>
        <div className={styles["tab-wrapper"]}>
          <ul className={styles["tabs"]}>
            {waitingCartList.map((tab) => (
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
                {waitingCartList.find((tab) => tab.courseId === activeTab)?.OPList.length || 0})
              </div>
              <div className={styles["standby-buggy"]}>
                <ul className={styles["standby-buggy-list"]}>
                  {waitingCartList
                    .find((tab) => tab.courseId === activeTab)
                    ?.OPList.map((item) => {
                      return (
                        <li key={item.bookingId} className={styles["standby-buggy-item"]}>
                          {item.bookingNm}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className={styles["standby"]}>
              <div className={styles["standby-title"]}>
                {t("monitoring.backStandby")}<br />(
                {waitingCartList.find((tab) => tab.courseId === activeTab)?.IPList.length || 0})
              </div>
              <div className={styles["standby-buggy"]}>
                <ul className={styles["standby-buggy-list"]}>
                  {waitingCartList
                    .find((tab) => tab.courseId === activeTab)
                    ?.IPList.map((item) => {
                      return (
                        <li key={item.bookingId} className={styles["standby-buggy-item"]}>
                          {item.bookingNm}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <button
          className={styles["close-button"]}
          onClick={() => {
            setStandByPopup(false);
          }}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default StandByPopup;
