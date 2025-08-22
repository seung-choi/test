import { atom } from "recoil";

// 대기 팝업 표시 상태를 관리하는 atom
export const standByPopupState = atom<boolean>({
  key: "standByPopupState",
  default: false,
});
