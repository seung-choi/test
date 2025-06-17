export const getOriginURL = (subdomain: string, path = "/mng/v1/"): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const origin = window.location.origin.includes("localhost")
    ? "http://43.202.78.220:7010"
    : window.location.origin;

  return (window.location.protocol.startsWith("https")
    ? origin.replace("mo", subdomain === "gps" ? "gpis" : "apis")
    : origin.replace(":7010", subdomain === "gps" ? ":7120" : ":7110")) + path;
};