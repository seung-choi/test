"use client";

import styles from "@/styles/components/monitoring/FloatingStandBy.module.scss";
import { useState } from "react";

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

const FloatingStandBy = ({ waitingCartList }: waitingCartListType) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(waitingCartList[0]?.courseId);

  return (
    <div className={`${styles["standby-container"]} ${open ? styles["open"] : ""}`}>
      <div
        className={styles["dim"]}
        onClick={() => {
          setOpen(!open);
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
                전반 대기 <br />(
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
                후반 대기 <br />(
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
          className={styles["floating-button"]}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default FloatingStandBy;
