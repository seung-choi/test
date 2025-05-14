"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertModal from "@/components/AlertModal";
import "@/lib/i18n";
import i18n from "@/lib/i18n";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [i18nReady, setI18nReady] = useState(false);
  const [orientationClass, setOrientationClass] = useState("portrait");

  useEffect(() => {
    const isLandscapePage = pathname === "/monitoring/" || pathname === "/holecup/";

    const handleOrientationChange = () => {
      // 더 안전한 방향 감지 로직 사용
      const isLandscape = window.innerWidth > window.innerHeight;

      setOrientationClass(() => {
        if (isLandscapePage) return isLandscape ? "landscape" : "rotate-landscape";
        return isLandscape ? "rotate-portrait" : "portrait";
      });
    };

    // 초기 방향 설정
    handleOrientationChange();

    // 이벤트 리스너 등록
    const events = ["orientationchange", "resize"];
    events.forEach(event => window.addEventListener(event, handleOrientationChange));

    // 클린업 함수
    return () => {
      events.forEach(event => window.removeEventListener(event, handleOrientationChange));
    };
  }, [pathname]);

  useEffect(() => {
    try {
      const currentPath = window.location.pathname;
      const hasSession = sessionStorage && sessionStorage.length > 1;

      if (currentPath !== "/" && hasSession) {
        router.push(currentPath);
      } else if (
        !hasSession &&
        currentPath !== "/" &&
        currentPath !== "/login" &&
        currentPath !== "/repassword"
      ) {
        router.push("/login");
      }

      const handleI18nInit = () => {
        setI18nReady(true);
      };

      if (i18n.isInitialized) {
        handleI18nInit();
      } else {
        i18n.on('initialized', handleI18nInit);
      }

      return () => {
        i18n.off('initialized', handleI18nInit);
      };
    } catch (error) {
      console.error('Error in initialization:', error);
      // 기본적으로 초기화 완료로 처리하여 앱이 작동하도록 함
      setI18nReady(true);
    }
  }, [router]);

  // 초기화 전 로딩 상태 표시
  if (!i18nReady) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <div className={`layout ${orientationClass}`}>
          {children}
          <AlertModal />
        </div>
      </QueryClientProvider>
    </RecoilRoot>
  );
};