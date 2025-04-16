import { atom } from "recoil";

export interface AlertModalType {
  isShow?: boolean;
  desc?: string;
  cancleBtnLabel?: string;
  cancleCallback?: VoidFunction;
  okBtnLabel?: string;
  okCallback?: VoidFunction;
  actionUrl?: string;
}

export const alertModalState = atom<AlertModalType>({
  key: "alertModal",
  default: {
    isShow: false,
  },
});
