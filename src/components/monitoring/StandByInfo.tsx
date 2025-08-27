import styles from "@/styles/components/monitoring/StandByInfo.module.scss";
import BookingType from "@/types/Booking.type";

const StandByInfo = ({ type, standbyList }: { type: "OW" | "IW", standbyList: BookingType[] }) => {
  return (
    <div className={styles["standby-info-container"]}>
      <h4 className={styles["standby-info-title"]}>
        {type === "OW" ? "전반 대기" : "후반 대기"}
      </h4>
      <div className={styles["standby-info-content"]}>
        {/* 주요 대기자 정보 */}
        <div className={styles["standby-first-booking"]}>
          <strong className={styles["standby-first-booking-name"]}>
            {standbyList[0]?.bookingNm}
          </strong>
          <span className={styles["standby-first-booking-time"]}>
            {standbyList[0]?.bookingTm}
          </span>
        </div>
        <em className={styles["standby-all-count"]}>{standbyList.length || 0}팀</em>
      </div>
    </div>
  ) 
}

export default StandByInfo;