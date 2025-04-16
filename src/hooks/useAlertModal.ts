import { useRecoilState } from "recoil";
import { alertModalState } from "@/lib/recoil/alertModal";

const useAlertModal = () => {
  const [alertModal, setAlertModalState] = useRecoilState(alertModalState);
  const closeAlertModal = () => setAlertModalState({ isShow: false });
  return { alertModal, setAlertModalState, closeAlertModal };
};
export default useAlertModal;
