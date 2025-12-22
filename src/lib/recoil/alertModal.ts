import { atom } from "recoil";

export interface AlertModalType {
  isShow?: boolean;
  desc?: string;
  cancelBtnLabel?: string;
  cancelCallback?: VoidFunction;
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
