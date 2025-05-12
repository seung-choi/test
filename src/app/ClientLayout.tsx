"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertModal from "@/components/AlertModal";
import "@/lib/i18n";
import i18n from "@/lib/i18n";
import useAutoRefreshOnRotate from "@/hooks/useAutoRefreshOnRotate";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const router = useRouter();
  const [i18nReady, setI18nReady] = useState(false);

  useAutoRefreshOnRotate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== "/" && sessionStorage.length > 1) {
      router.push(currentPath);
    } else if (
      sessionStorage.length < 1 &&
      currentPath !== "/" &&
      currentPath !== "/login" &&
      currentPath !== "/repassword"
    ) {
      router.push("/login");
    }

    if (i18n.isInitialized) {
      setI18nReady(true);
    } else {
      i18n.on('initialized', () => {
        setI18nReady(true);
      });
    }
  }, [router]);

  if (!i18nReady) {
    // 초기화 전에는 아무 것도 안 보여줌
    return null;
    // 또는 로딩 컴포넌트
    // return <div>Loading...</div>;
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {children}
        <AlertModal />
      </QueryClientProvider>
    </RecoilRoot>
  );
};