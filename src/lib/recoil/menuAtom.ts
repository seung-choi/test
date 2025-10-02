import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// recoil-persist 설정
const { persistAtom } = recoilPersist();

// 메뉴 데이터 atom (recoil-persist 적용)
export const menuState = atom<string[]>({
  key: "menu",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
