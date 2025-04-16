"use client";

import styles from "@/styles/components/AlertModal.module.scss";
import { useRouter } from "next/navigation";
import useAlertModal from "@/hooks/useAlertModal";
import { Button } from "@/components/Button";

const AlertModal = () => {
  const router = useRouter();
  const { alertModal, closeAlertModal } = useAlertModal();

  const handleClickOk = () => {
    alertModal.actionUrl ? router.push(alertModal.actionUrl) : alertModal.okCallback?.();
    closeAlertModal();
  };

  const handleClickCancle = () => {
    if(alertModal?.cancleCallback) {
      alertModal.cancleCallback?.();
      closeAlertModal();
    } else {
      closeAlertModal();
    }
  };

  return (
    <>
      {alertModal.isShow && (
        <div className={styles["alert-popup"]}>
          <div className={styles["alert-popup-inner"]}>
            <p className={styles["alert-popup-desc"]}>{alertModal.desc}</p>
            <div className={styles["alert-popup-button-container"]}>
              <Button
                type="button"
                label={alertModal.cancleBtnLabel || "취소"}
                onClick={handleClickCancle}
              />
              <Button
                type="button"
                label={alertModal.okBtnLabel || "확인"}
                primary={true}
                onClick={handleClickOk}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AlertModal;
