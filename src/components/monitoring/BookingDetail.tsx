import styles from "@/styles/components/monitoring/BookingDetail.module.scss";
import BookingType from "@/types/Booking.type";
import { Button } from "../Button";
import { formatGender } from "@/utils/formatGender";
import { useRecoilValue } from "recoil";
import { menuState } from "@/lib/recoil";
// import { calculateProgressTime } from "@/utils/calculateProgressTime";

interface BookingDetailProps {
  booking: BookingType | null;
  onBack: () => void;
  onSendMessage: () => void; // 메시지 보내기 버튼 클릭 시 호출될 함수 추가
}

const BookingDetail = ({ booking, onBack, onSendMessage }: BookingDetailProps) => {
  const menuCodes = useRecoilValue(menuState);

  return (
    <div className={styles["booking-detail-container"]}>
      <div className={styles["head"]}>
        <button type="button" className={styles["head-arrow"]} onClick={onBack}>
          <span className="blind">back</span>
        </button>
        <h1 className={styles["head-title"]}>검색하기</h1>
      </div>

      <div className={styles["content"]}>
        <div className={styles["booking-detail-inner"]}>
          <h2 className={styles["booking-name"]}>
            {booking?.bookingNm} {booking?.bookingsNm && `(${booking.bookingsNm})`}
            {booking?.bookingTm && (
              <span className={styles["booking-teeOff"]}>{booking?.bookingTm}</span>
            )}
          </h2>
          <div className={styles["booking-player-info"]}>
            <h3 className={styles["booking-player-title"]}>내장객 정보</h3>
            <ul className={styles["booking-player-list"]}>
              {booking?.playerList?.map((player) => (
                <li key={player.playerId} className={styles["booking-player-item"]}>
                  {" "}
                  {player.playerNm}&#40;{formatGender(player.playerGen || null)}&#41;
                </li>
              ))}
            </ul>
          </div>
          <div className={styles["booking-detail-info"]}>
            <h3 className={styles["booking-detail-info-title"]}>주요 정보</h3>
            <div className={styles["booking-detail-info-list"]}>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>현재 위치</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>
                  {booking?.courseNm}{" "}
                  {booking?.status === "OW"
                    ? "전반 대기중"
                    : booking?.status === "IW"
                      ? "후반 대기중"
                      : `H${booking?.holeNo}`}
                </dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>전반-후반</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>
                  {booking?.outCourseNm}-{booking?.inCourseNm}
                </dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>전반 시작</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>
                  {booking?.outStartTm || "-"}
                </dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>전반 진행</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>
                  {/*{calculateProgressTime(booking?.outStartTm || null, booking?.outEndTm || null)}*/}
                  {booking?.outRunTm}
                </dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>후반 시작</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>
                  {booking?.inStartTm || "-"}
                </dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>후반 진행</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>
                  {/*calculateProgressTime(booking?.inStartTm || null, booking?.inEndTm || null)}*/}
                  {booking?.inRunTm}
                </dd>
              </dl>
            </div>
          </div>
          {menuCodes?.includes("M_SSE") && (
            <div className={styles["button-wrapper"]}>
              <Button primary type="button" block label="메시지 보내기" onClick={onSendMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
