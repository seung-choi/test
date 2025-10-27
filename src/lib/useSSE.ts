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
  const retryCountRef = useRef<number>(0);
  const openCallbackRef = useRef<(() => void) | null>(null); // open 함수를 ref에 저장
  const destroyedRef = useRef(false); // destroyed 상태를 ref로 관리
  const setPin = useSetRecoilState(ssePinState);
  const setSOS = useSetRecoilState(sseSOSState);
  const setSOSPopupList = useSetRecoilState(sseSOSPopupListState);

  // tokenRefreshed 이벤트 리스너 - 직접 재연결
  useEffect(() => {
    const handleTokenRefresh = () => {
      console.log("handleTokenRefresh 내부 진입");
      // retryCount 초기화
      retryCountRef.current = 0;

      // 기존 연결 종료
      eventSourseRef.current?.close();
      eventSourseRef.current = null;

      // 재연결 - openCallbackRef가 준비될 때까지 대기
      const retryReconnect = () => {
        if (pathname === "/monitoring/" && !destroyedRef.current) {
          if (openCallbackRef.current) {
            openCallbackRef.current();
          } else {
            // open 함수가 아직 준비되지 않았으면 다시 시도
            setTimeout(retryReconnect, 50);
          }
        }
      };

      setTimeout(retryReconnect, 100);
    };

    window.addEventListener("tokenRefreshed", handleTokenRefresh);

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefresh);
    };
  }, [pathname]);

  useEffect(() => {
    destroyedRef.current = false;

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

        console.log("eventSource.onerror 내부 진입", error);

        if (status >= 500) {
          window.location.reload();
          return;
        }

        // 500 미만 에러들에 대해 재시도 로직
        console.log("retryCountRef.current : ", retryCountRef.current);
        retryCountRef.current += 1;

        if (retryCountRef.current >= 3) {
          // 3번 이상 에러 발생 시 토큰 리프레시 이벤트 발생
          console.log("3번 이상 에러 발생 후 토큰 리프레시 이벤트 발생");
          window.dispatchEvent(new CustomEvent("tokenRefreshed"));
          return;
        }

        // 기존 연결 종료
        eventSourseRef.current?.close();
        eventSourseRef.current = null;

        // 1초 후 재연결 시도
        setTimeout(() => {
          if (!destroyedRef.current) {
            open();
          }
        }, 1000);
      };
    };

    open();

    // open 함수를 ref에 저장
    openCallbackRef.current = open;

    return () => {
      destroyedRef.current = true;
      eventSourseRef.current?.close();
      eventSourseRef.current = null;
      openCallbackRef.current = null;
    };
  }, [pathname]); // pathname만 의존성으로 사용 (refreshTrigger 제거)

  return null;
};

export default useSSE;
