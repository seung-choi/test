"use client";

import { useEffect, useRef, useState } from "react";
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

// 토큰 갱신 이벤트를 감지하는 커스텀 훅
const useTokenRefresh = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleTokenRefresh = () => {
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("tokenRefreshed", handleTokenRefresh);

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefresh);
    };
  }, []);

  return refreshTrigger;
};

const useSSE = () => {
  const pathname = usePathname();
  const refreshTrigger = useTokenRefresh(); // 토큰 갱신 트리거
  const eventSourseRef = useRef<EventSourcePolyfill | null>(null);
  const retryCountRef = useRef<number>(0);
  const setPin = useSetRecoilState(ssePinState);
  const setSOS = useSetRecoilState(sseSOSState);
  const setSOSPopupList = useSetRecoilState(sseSOSPopupListState);

  useEffect(() => {
    let destroyed = false;

    if (pathname !== "/monitoring/") {
      eventSourseRef.current?.close();
      eventSourseRef.current = null;
      return;
    }

    const open = () => {
      const currentSessionId = sessionManager.sessionId;
      const url = getOriginURL("api", `/mng/v1/subscribe/${currentSessionId}`);
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

      eventSource.onopen = () => {
        // 연결 성공 시 재시도 카운터 초기화
        retryCountRef.current = 0;
      };

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

      eventSource.addEventListener("SUBSCRIBED", () => {
        retryCountRef.current = 0;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventSource.onerror = (error: any) => {
        const status = error?.status ?? error?.detail?.status;

        if (status >= 500) {
          window.location.reload();
          return;
        }

        // 500 미만 에러들에 대해 재시도 로직
        retryCountRef.current += 1;
        console.warn(`SSE 연결 에러 (${retryCountRef.current}/3):`, error);

        if (retryCountRef.current >= 3) {
          console.warn("SSE 최대 재시도 횟수 초과, 페이지 새로고침");
          window.location.reload();
          return;
        }

        // 기존 연결 종료
        eventSourseRef.current?.close();
        eventSourseRef.current = null;

        // 1초 후 재연결 시도
        setTimeout(() => {
          if (!destroyed) {
            open();
          }
        }, 1000);
      };
    };

    open();

    return () => {
      destroyed = true;
      eventSourseRef.current?.close();
      eventSourseRef.current = null;
    };
  }, [pathname, refreshTrigger]); // pathname과 refreshTrigger를 의존성에 추가

  return null;
};

export default useSSE;
