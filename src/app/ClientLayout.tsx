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

    console.log("pathname", pathname);
    const handleOrientationChange = () => {
      const { orientation } = window.screen;
      const isLandscape = orientation?.type?.includes("landscape") || window.innerWidth > window.innerHeight;

      setOrientationClass((prev) => {
        if (isLandscapePage) return isLandscape ? "landscape" : "rotate-landscape";
        return isLandscape ? "rotate-portrait" : "portrait";
      });
    };

    handleOrientationChange();
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [pathname]);

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
        <div className={`layout ${orientationClass}`}>
          {children}
        <AlertModal />
        </div>
      </QueryClientProvider>
    </RecoilRoot>
  );
};