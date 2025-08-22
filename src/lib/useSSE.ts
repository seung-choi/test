"use client";

import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useSetRecoilState } from "recoil";
import { getOriginURL } from "@/api/API_URL";
import { usePathname } from "next/navigation";
import { ssePinState, sseSOSState, sseSOSPopupOpenState } from "@/lib/recoil";
import { SSEPinData, SSESOSData } from "@/types/sseType";

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
    return window.sessionStorage.getItem("accessToken") ?? "";
  },
  set access(token: string) {
    window.sessionStorage.setItem("accessToken", token);
  },
  get refresh() {
    return window.sessionStorage.getItem("refreshToken") ?? "";
  },
  set refresh(token: string) {
    window.sessionStorage.setItem("refreshToken", token);
  },
};

const eventStore = {
  get id() {
    return window.sessionStorage.getItem("eventId") ?? "";
  },
  set id(id: string) {
    window.sessionStorage.setItem("eventId", id);
  },
};

const sessionManager = {
  get sessionId() {
    let sessionId = window.sessionStorage.getItem("sseSessionId");
    if (!sessionId) {
      sessionId = generateNumericSessionId();
      window.sessionStorage.setItem("sseSessionId", sessionId);
    }
    return sessionId;
  },
};

const useSSE = () => {
  const pathname = usePathname();
  const eventSourseRef = useRef<EventSourcePolyfill | null>(null);
  const setPin = useSetRecoilState(ssePinState);
  const setSOS = useSetRecoilState(sseSOSState);
  const setSOSPopupOpen = useSetRecoilState(sseSOSPopupOpenState);

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

      console.log(url);

      const eventSource = new EventSourcePolyfill(url, {
        withCredentials: true,
        headers,
        heartbeatTimeout: 172800000,
      });

      eventSourseRef.current = eventSource;

      eventSource.onopen = () => {
        console.log(`SSE 연결 성공 - Session ID: ${currentSessionId}`);
      };

      eventSource.addEventListener("PIN", (e) => {
        const event = e as MessageEvent;
        const data = event.data ? JSON.parse(event.data) : null;
        if (data) setPin(data as SSEPinData[]);
      });

      eventSource.addEventListener("SOS", (e) => {
        const event = e as MessageEvent;
        const data = event.data ? JSON.parse(event.data) : null;
        console.log("SOS data", data);
        if (data) {
          setSOS(data as SSESOSData)
          setSOSPopupOpen(true);
        };
      });

      eventSource.addEventListener("SUBSCRIBED", () => {
        console.log("구독 성공 이벤트");
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventSource.onerror = (err: any) => {
        const status = err?.status ?? err?.detail?.status;
        const code = err?.body?.code;

        if (status === 401 || code === "JWT_EXPIRED_TOKEN") {
          window.sessionStorage.clear();
          window.location.href = "/login";
          return;
        }
      };
    };

    open();

    return () => {
      destroyed = true;
      eventSourseRef.current?.close();
      eventSourseRef.current = null;
    };
  }, []);

  return null;
};

export default useSSE;
