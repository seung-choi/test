"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAutoRefreshOnRotate = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOrientationChange = () => {
      router.refresh(); // 새로고침 대신 Soft Refresh
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    return () => window.removeEventListener("orientationchange", handleOrientationChange);
  }, [router]);
};

export default useAutoRefreshOnRotate;
