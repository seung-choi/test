const originURL = (subdomain: string, path = "/mng/v1/") => {
  const origin = window.location.origin.includes("localhost") ? "http://43.202.78.220:7010" : window.location.origin;
  return (window.location.protocol.startsWith("https")
    ? window.location.origin.replace('mo', "gps" === subdomain ? "gpis" : "apis")
    : origin.replace(':7010', ('gps' === subdomain) ? ":7120" : ":7110")) + path;
};

export const API_URL =  originURL("api");
export const GPS_URL = originURL("gps");
