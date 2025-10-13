import { atom } from "recoil";

// bookingsNo별 팀 클래스 매핑을 저장하는 Recoil state
export const teamClassMappingState = atom<Map<string, string>>({
  key: "teamClassMappingState",
  default: new Map(),
});
