export const getOriginURL = (subdomain: string, path = "/mng/v1/"): string | null => {
  if (typeof window === "undefined") {
    // SSR 환경에선 window 없음
    return null;
  }

  const origin = window.location.origin.includes("localhost")
    ? "http://43.202.78.220:7010"
    : window.location.origin;

  return (window.location.protocol.startsWith("https")
    ? origin.replace("mo", subdomain === "gps" ? "gpis" : "apis")
    : origin.replace(":7010", subdomain === "gps" ? ":7120" : ":7110")) + path;
};

export const API_URL =  getOriginURL("api");
export const GPS_URL = getOriginURL("gps");
