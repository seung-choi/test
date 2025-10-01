import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "monitoringViewState", // localStorage에 저장될 키
});

// 모니터링 뷰 상태를 관리하는 atom (새로고침 후에도 유지됨)
export const monitoringViewState = atom<"course" | "map">({
  key: "monitoringViewState",
  default: "course",
  effects_UNSTABLE: [persistAtom], // persist 효과 추가
});
