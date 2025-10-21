import React from "react";
import styles from "@/styles/components/monitoring/BookingDetailPopup.module.scss";
import BookingType from "@/types/Booking.type";
import { useRecoilValue } from "recoil";
import { menuState } from "@/lib/recoil";
import { removeWhitespace } from "@/utils/removeWhitespace";

interface BookingDetailPopupProps {
  booking: BookingType | null;
  onClose: () => void;
}

const BookingDetailPopup = ({ booking, onClose }: BookingDetailPopupProps) => {
  const menuCodes = useRecoilValue(menuState);

  if (!menuCodes.includes("M_DETAIL")) {
    return null;
  }

  return (
    <div className={styles["booking-detail-popup-container"]}>
      <div className={styles["booking-detail-popup-overlay"]} onClick={onClose}></div>
      <div className={styles["booking-detail-popup-inner"]}>
        <h2 className={styles["booking-name"]}>
          <span className={styles["booking-name-text"]}>
            {booking?.bookingNm} {booking?.bookingsNm && `(${booking.bookingsNm})`}
          </span>
          {booking?.bookingTm && (
            <span className={styles["booking-teeOff"]}>{booking?.bookingTm}</span>
          )}
        </h2>
        <div className={styles["booking-detail-scroll-wrapper"]}>
          <h3 className={"blind"}>내장객 정보</h3>
          <ul className={styles["booking-player-list"]}>
            {booking?.playerList?.map((player) => (
              <li key={player.playerId} className={styles["booking-player-item"]}>
                <span title={player.playerNm + " (" + player.playerGen || "-" + ")"}>
                  {player.playerNm} ({player.playerGen || "-"})
                </span>
                <span title={player.sumScore?.toString() || "-"}>
                  {player.sumScore?.toString() || "-"}
                </span>
              </li>
            ))}
          </ul>
          <h3 className={"blind"}>주요 정보</h3>
          <div className={styles["booking-detail-info-list"]}>
            <dl className={styles["booking-detail-info-item"]}>
              <dt className={styles["booking-detail-info-item-title"]}>전반 시작</dt>
              <dd className={styles["booking-detail-info-item-desc"]}>
                {removeWhitespace(booking?.outStartTm) || "-"}
              </dd>
            </dl>
            <dl className={styles["booking-detail-info-item"]}>
              <dt className={styles["booking-detail-info-item-title"]}>전반 진행</dt>
              <dd className={styles["booking-detail-info-item-desc"]}>
                {/*{calculateProgressTime(booking?.outStartTm || null, booking?.outEndTm || null)}*/}
                {removeWhitespace(booking?.outRunTm) || "-"}
              </dd>
            </dl>
            <dl className={styles["booking-detail-info-item"]}>
              <dt className={styles["booking-detail-info-item-title"]}>후반 시작</dt>
              <dd className={styles["booking-detail-info-item-desc"]}>
                {removeWhitespace(booking?.inStartTm) || "-"}
              </dd>
            </dl>
            <dl className={styles["booking-detail-info-item"]}>
              <dt className={styles["booking-detail-info-item-title"]}>후반 진행</dt>
              <dd className={styles["booking-detail-info-item-desc"]}>
                {removeWhitespace(booking?.inRunTm) || "-"}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPopup;
