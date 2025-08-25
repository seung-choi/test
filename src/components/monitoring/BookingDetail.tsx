import styles from "@/styles/components/monitoring/BookingDetail.module.scss";
import BookingType from "@/types/Booking.type";
import { Button } from "../Button";

interface BookingDetailProps {
  bookingData: BookingType | null;
  onBack: () => void;
}

const BookingDetail = ({bookingData, onBack} :BookingDetailProps ) => {
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
          <h2 className={styles["booking-name"]}>김지원 <span className={styles["booking-teeOff"]}>11:12</span></h2>
          <div className={styles["booking-player-info"]}>
            <h3 className={styles["booking-player-title"]}>내장객 정보</h3>
            <ul className={styles["booking-player-list"]}>
              <li className={styles["booking-player-item"]}>김지원&#40;남성&#41;</li>
              <li className={styles["booking-player-item"]}>김지원&#40;남성&#41;</li>
              <li className={styles["booking-player-item"]}>김지원&#40;남성&#41;</li>
              <li className={styles["booking-player-item"]}>김지원&#40;남성&#41;</li>
              <li className={styles["booking-player-item"]}>김지원&#40;남성&#41;</li>
            </ul>
          </div>
          <div className={styles["booking-detail-info"]}>
            <h3 className={styles["booking-detail-info-title"]}>주요 정보</h3>
            <div className={styles["booking-detail-info-list"]}>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>현재 위치</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>Lake 5H</dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>전반-후반</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>Lake-Hill</dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>전반 시작</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>11:02</dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>전반 진행</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>11:02</dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>후반 시작</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>11:02</dd>
              </dl>
              <dl className={styles["booking-detail-info-item"]}>
                <dt className={styles["booking-detail-info-item-title"]}>후반 진행</dt>
                <dd className={styles["booking-detail-info-item-desc"]}>11:02</dd>
              </dl>
            </div>
          </div>
          <div className={styles["button-wrapper"]}>
            <Button primary type="button" block label="메시지 보내기" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;