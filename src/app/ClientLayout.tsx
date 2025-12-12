"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RecoilRoot, useRecoilValue } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertModal from "@/components/AlertModal";
import UnifiedModal from "@/components/modal/UnifiedModal";
import "@/lib/i18n";
import i18n from "@/lib/i18n";
import { themeModeState, menuState } from "@/lib/recoil";
import storage from "@/utils/storage";

// Recoil 훅을 사용하는 실제 로직 컴포넌트
const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const themeMode = useRecoilValue(themeModeState);
  const menuCodes = useRecoilValue(menuState);
  const [i18nReady, setI18nReady] = useState(false);

  // 언어 설정 초기화
  useEffect(() => {
    if (i18n.isInitialized) {
      setI18nReady(true);
    } else {
      i18n.on("initialized", () => {
        setI18nReady(true);
      });
    }
  }, []);

  // 경로 변경 및 인증 체크
  // useEffect(() => {
  //   const currentPath = pathname;
  //   const localStorageLength = storage.local.lengthExcept(["remember"]);
  //
  //   if (currentPath !== "/" && localStorageLength > 1) {
  //     router.push(currentPath);
  //   } else if (
  //     localStorageLength < 1 &&
  //     currentPath !== "/" &&
  //     !currentPath.startsWith("/login") &&
  //     !currentPath.startsWith("/repassword")
  //   ) {
  //     router.push("/login/");
  //   }
  // }, [pathname, router]);


  if (!i18nReady) {
    // 초기화 전에는 아무 것도 안 보여줌
    return null;
    // 또는 로딩 컴포넌트
    // return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className='layout' data-theme={themeMode}>
        {children}
        <AlertModal />
        <UnifiedModal />
      </div>
    </QueryClientProvider>
  );
};

// Recoil 훅을 사용하지 않는 래퍼 컴포넌트
export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </RecoilRoot>
  );
};
