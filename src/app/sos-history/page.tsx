"use client";
import styles from "@/styles/pages/sos-history/sos-history.module.scss";
import { useRouter } from "next/navigation";

const SOSHistory = () => {
  const router = useRouter();

  return (
    <>
      <h1 className="blind">오늘 긴급호출 목록</h1>
      <div className={styles["sos-history-container"]}>
        <div className={styles["sos-history-header"]}>
          <button type="button" className={styles["sos-history-arrow-button"]} onClick={() => router.push("/monitoring/")}>
            <span className="blind">back</span>
          </button>
          <h2 className={styles["sos-history-title"]}>오늘 긴급호출 목록</h2>
        </div>
        <div className={styles["sos-history-list-wrap"]}>
            <ul className={styles["sos-history-list"]}>
                <li className={`${styles["sos-history-item"]} ${styles["header"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
                <li className={`${styles["sos-history-item"]} ${styles["body"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
                <li className={`${styles["sos-history-item"]} ${styles["body"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
                <li className={`${styles["sos-history-item"]} ${styles["body"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
                <li className={`${styles["sos-history-item"]} ${styles["body"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
                <li className={`${styles["sos-history-item"]} ${styles["body"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
                <li className={`${styles["sos-history-item"]} ${styles["body"]}`}>
                    <span className={styles["sos-history-item-time"]}>호출 시간</span>
                    <span className={styles["sos-history-item-caller"]}>호출자</span>
                    <span className={styles["sos-history-item-teeoff"]}>티오프</span>
                    <span className={styles["sos-history-item-location"]}>위치</span>
                    <span className={styles["sos-history-item-reason"]}>사유</span>
                </li>
            </ul>
        </div>
      </div>
    </>
  );
};

export default SOSHistory;