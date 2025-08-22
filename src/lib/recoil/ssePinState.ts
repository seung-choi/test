import { atom } from "recoil";
import { SSEPinData } from "@/types/sseType";

export const ssePinState = atom<SSEPinData[]>({
  key: "sse/pin",
  default: [],
});
