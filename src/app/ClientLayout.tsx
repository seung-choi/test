"use client";

import React from "react";
import { RecoilRoot} from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UnifiedModal from "@/components/admin/modal/UnifiedModal";
import GlobalToast from "@/components/common/GlobalToast";
import { useApiErrorHandler } from "@/hooks/common/useApiErrorHandler";

const ApiErrorHandler = () => {
  useApiErrorHandler();
  return null;
};

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ApiErrorHandler />
      <div className='layout'>
        {children}
        <UnifiedModal />
        <GlobalToast />
      </div>
    </QueryClientProvider>
  );
};

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </RecoilRoot>
  );
};
