import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "themeMode-persist", // 로컬 스토리지 키
});

// 테마 모드 타입 정의
export type ThemeMode = "dark" | "light";

// 테마 모드 상태 (로컬 스토리지에 저장)
export const themeModeState = atom<ThemeMode>({
  key: "themeModeState",
  default: "dark",
  effects_UNSTABLE: [persistAtom], // recoil-persist 적용
});
