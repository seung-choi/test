import { atom } from "recoil";
import { SSESOSData } from "@/types/sseType";

export const sseSOSState = atom<SSESOSData | null>({
  key: "sse/sos",
  default: null,
});

export const sseSOSPopupOpenState = atom<boolean>({
  key: "sseSOSPopupOpenStates",
  default: false,
});
