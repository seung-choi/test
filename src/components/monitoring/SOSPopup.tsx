import { useRecoilValue, useSetRecoilState } from "recoil";
import { menuState, sseSOSPopupListState } from "@/lib/recoil";
import styles from "@/styles/components/monitoring/SOSPopup.module.scss";
import { Button } from "@/components/Button";

const SOSPopup = () => {
  const sosPopupList = useRecoilValue(sseSOSPopupListState);
  const setSOSPopupList = useSetRecoilState(sseSOSPopupListState);
  const menuCodes = useRecoilValue(menuState);

  // 특정 SOS 팝업을 닫는 함수
  const closeSOSPopup = (popupId: string) => {
    setSOSPopupList((prevList) => prevList.filter((popup) => popup.id !== popupId));
  };

  if (!menuCodes.includes("M_MAYDAY")) {
    return null;
  }

  // 팝업이 없으면 렌더링하지 않음
  if (sosPopupList.length === 0) {
    return null;
  }

  return (
    <>
      {sosPopupList.map((popup) => (
        <div key={popup.id} className={styles["sos-popup"]}>
          <div
            className={styles["sos-popup-inner"]}
            style={{
              marginTop: `${popup.position.marginTop}px`,
              marginLeft: `${popup.position.marginLeft}px`,
            }}
          >
            <h2 className={styles["sos-popup-title"]}>
              긴급호출 발생 &#40;{popup.data?.createdDt}&#41;
            </h2>
            <div className={styles["sos-popup-content"]}>
              <dl className={styles["sos-popup-info"]}>
                <dt>호출자</dt>
                <dd>{popup.data?.bookingNm}</dd>
              </dl>
              <dl className={styles["sos-popup-info"]}>
                <dt>티오프</dt>
                <dd>{popup.data?.bookingTm}</dd>
              </dl>
              <dl className={styles["sos-popup-info"]}>
                <dt>위치</dt>
                <dd>
                  {popup.data?.courseNm} H{popup.data?.holeNo}
                </dd>
              </dl>
              <dl className={styles["sos-popup-info"]}>
                <dt>사유</dt>
                <dd>{popup.data?.eventCont}</dd>
              </dl>
            </div>
            <div className={styles["sos-popup-button-container"]}>
              <Button type="button" label="닫기" onClick={() => closeSOSPopup(popup.id)} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SOSPopup;
