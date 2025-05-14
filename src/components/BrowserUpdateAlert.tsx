import React, { useEffect, useState } from 'react';
import { isOldSamsungBrowser, isSamsungBrowser } from "@/utils/browserCheck";

const BrowserUpdateAlert: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const shouldShowAlert = isSamsungBrowser() && isOldSamsungBrowser();
    setShowAlert(shouldShowAlert);
  }, []);

  if (!showAlert) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ff4444',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        zIndex: 9999,
      }}
    >
      <p style={{ margin: 0 }}>
        원활한 서비스 이용을 위해 삼성 인터넷 브라우저를 최신 버전으로 업데이트해 주세요.
      </p>
    </div>
  );
};

export default BrowserUpdateAlert;