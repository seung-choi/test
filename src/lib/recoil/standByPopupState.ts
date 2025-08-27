import { atom } from "recoil";

// 대기 팝업 표시 상태와 선택된 코스 ID를 관리하는 atom
export interface StandByPopupState {
  isOpen: boolean;
  selectedCourseId: number | null;
}

export const standByPopupState = atom<StandByPopupState>({
  key: "standByPopupState",
  default: {
    isOpen: false,
    selectedCourseId: null,
  },
});
