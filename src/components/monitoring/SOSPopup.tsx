import { useRecoilValue, useSetRecoilState } from "recoil";
import { sseSOSPopupOpenState, sseSOSState } from "@/lib/recoil";
import styles from "@/styles/components/monitoring/SOSPopup.module.scss";
import { Button } from "@/components/Button";

const SOSPopup = () => {
  const sos = useRecoilValue(sseSOSState);
  const setSOSPopupOpen = useSetRecoilState(sseSOSPopupOpenState);
  return  (
  <div className={styles["sos-popup"]}>
    <div className={styles["sos-popup-inner"]}>
        <h2 className={styles["sos-popup-title"]}>긴급호출 발생 &#40;{sos?.createdDt}&#41;</h2>
        <div className={styles["sos-popup-content"]}>
            <dl className={styles["sos-popup-info"]}>
                <dt>호출자</dt>
                <dd>{sos?.bookingNm}</dd>
            </dl>
            <dl className={styles["sos-popup-info"]}>
                <dt>티오프</dt>
                <dd>{sos?.bookingTm}</dd>
            </dl>
            <dl className={styles["sos-popup-info"]}>
                <dt>위치</dt>
                <dd>{sos?.courseNm} H{sos?.holeNo}</dd>
            </dl>
            <dl className={styles["sos-popup-info"]}>
                <dt>사유</dt>
                <dd>{sos?.eventCont}</dd>
            </dl>
        </div>
        <div className={styles["sos-popup-button-container"]}>
            <Button type="button" label="닫기" onClick={() => setSOSPopupOpen(false)} />
        </div>
    </div>
  </div>
  );
};

export default SOSPopup;