import { atom } from "recoil";
import {recoilPersist} from "recoil-persist";
const { persistAtom } = recoilPersist();

export const currentCourseState = atom<{
  id: number | null,
  Nm: string | null,
}>({
  key: "currentCourse",
  default: {
    id: null,
    Nm: null,
  },
  effects_UNSTABLE: [persistAtom],
});
