import { atom } from "recoil";
import {recoilPersist} from "recoil-persist";
const { persistAtom } = recoilPersist();

export const currentHoleState = atom<{
    id: number | null,
    no: number | null,
}>({
    key: "currentHole",
    default: {
        id: null,
        no: null,
    },
    effects_UNSTABLE: [persistAtom],
});
