"use client";

import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useSetRecoilState } from "recoil";
import { getOriginURL } from "@/api/API_URL";
import { usePathname } from "next/navigation";
import { ssePinState, sseSOSState, sseSOSPopupListState } from "@/lib/recoil";
import { SSEPinData, SSESOSData } from "@/types/sseType";
import storage from "@/utils/storage";

// 숫자로만 구성된 10자리 세션 ID 생성 함수
const generateNumericSessionId = (): string => {
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

const tokens = {
  get access() {
    return (storage.local.get("accessToken") as string) ?? "";
  },
  set access(token: string) {
    storage.local.set({ accessToken: token });
  },
  get refresh() {
    return (storage.local.get("refreshToken") as string) ?? "";
  },
  set refresh(token: string) {
    storage.local.set({ refreshToken: token });
  },
};

const eventStore = {
  get id() {
    return (storage.local.get("eventId") as string) ?? "";
  },
  set id(id: string) {
    storage.local.set({ eventId: id });
  },
};

const sessionManager = {
  get sessionId() {
    let sessionId = storage.local.get("sseSessionId") as string;
    if (!sessionId) {
      sessionId = generateNumericSessionId();
      storage.local.set({ sseSessionId: sessionId });
    }
    return sessionId;
  },
};

const useSSE = () => {
  const pathname = usePathname();
  const eventSourseRef = useRef<EventSourcePolyfill | null>(null);
  const setPin = useSetRecoilState(ssePinState);
  const setSOS = useSetRecoilState(sseSOSState);
  const setSOSPopupList = useSetRecoilState(sseSOSPopupListState);
  const clubId = storage.local.get("clubId");

  useEffect(() => {
    if (pathname !== "/monitoring/") {
      // 모니터링 페이지가 아닐 경우 SSE 연결 종료
      eventSourseRef.current?.close();
      eventSourseRef.current = null;
      return;
    }

    const open = () => {
      const currentSessionId = sessionManager.sessionId;
      const url = getOriginURL("api", `/mng/v1/subscribe/${clubId}/${currentSessionId}`);
      if (!url) return;

      const headers: Record<string, string> = {};
      if (tokens.access) headers["Authorization"] = tokens.access;
      if (eventStore.id) headers["Event-ID"] = eventStore.id;

      const eventSource = new EventSourcePolyfill(url, {
        withCredentials: true,
        headers,
        heartbeatTimeout: 172800000,
      });

      eventSourseRef.current = eventSource;

      eventSource.onopen = () => {};

      eventSource.addEventListener("PIN", (e) => {
        const event = e as MessageEvent;
        const data = event.data ? JSON.parse(event.data) : null;
        if (data) setPin(data as SSEPinData[]);
      });

      eventSource.addEventListener("SOS", (e) => {
        const event = e as MessageEvent;
        const data = event.data ? JSON.parse(event.data) : null;
        if (data) {
          const sosData = data as SSESOSData;
          setSOS(sosData);

          // 새로운 SOS 팝업 아이템 생성
          const newPopupItem = {
            id: `${sosData.eventNo}_${Date.now()}`, // eventNo + timestamp로 고유 ID 생성
            data: sosData,
            position: {
              marginTop: Math.floor(Math.random() * 14) + 2, // 2px ~ 15px 사이의 랜덤 값
              marginLeft: Math.floor(Math.random() * 14) + 2, // 2px ~ 15px 사이의 랜덤 값
            },
          };

          // 기존 팝업 목록에 새로운 팝업 추가
          setSOSPopupList((prevList) => [...prevList, newPopupItem]);
        }
      });

      eventSource.addEventListener("SUBSCRIBED", () => {});

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventSource.onerror = (error: any) => {
        console.error("SSE 오류 발생:", error);
        return;
      };
    };

    open();

    return () => {
      //컴포넌트 언마운트 시 SSE 연결 종료.
      eventSourseRef.current?.close();
      eventSourseRef.current = null;
    };
  }, [pathname, clubId]);

  return null;
};

export default useSSE;
