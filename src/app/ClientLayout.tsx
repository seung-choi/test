"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertModal from "@/components/AlertModal";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const router = useRouter();

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
  }, [router]);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {children}
        <AlertModal />
      </QueryClientProvider>
    </RecoilRoot>
  );
};
