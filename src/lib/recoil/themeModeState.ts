import { atom } from "recoil";

// 테마 모드 타입 정의
export type ThemeMode = "dark" | "light";

// 테마 모드 상태 (기본값: light-mode)
export const themeModeState = atom<ThemeMode>({
  key: "themeModeState",
    default: "light",
});
