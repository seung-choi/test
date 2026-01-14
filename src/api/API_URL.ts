export const getOriginURL = (subdomain: string, path = ""): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const origin = window.location.origin.includes("localhost")
    ? "http://43.202.78.220:7050"
    : window.location.origin;

  return (
    (window.location.protocol.startsWith("https")
      ? origin.replace("fnb", subdomain === "gps" ? "gps" : "api")
      : origin.replace(":7050", subdomain === "gps" ? ":7120" : ":7110")) + path
  );
};
