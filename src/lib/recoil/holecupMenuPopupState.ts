import { atom } from "recoil";

// 메뉴 팝업의 열림/닫힘 상태를 관리하는 atom
export const holecupMenuPopupState = atom<boolean>({
  key: "menuPopupOpholecupMenuPopupStateenState",
  default: false,
});
