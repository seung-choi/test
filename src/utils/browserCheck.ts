export const isSamsungBrowser = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('samsungbrowser');
};

export const isOldSamsungBrowser = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  if (!userAgent.includes('samsungbrowser')) return false;

  // Samsung Browser 버전 추출
  const match = userAgent.match(/samsungbrowser\/([0-9.]+)/);
  if (!match) return false;

  const version = parseFloat(match[1]);
  // 버전 20.0 미만을 구버전으로 간주 (이 숫자는 필요에 따라 조정 가능)
  return version < 20.0;
};