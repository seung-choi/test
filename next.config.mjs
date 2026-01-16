import nextPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const customRuntimeCaching = [
  {
    urlPattern: ({ url }) => url.href.includes("/fnb/v1/"),
    handler: "NetworkFirst",
    options: {
      cacheName: "api-cache",
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 5,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === "image",
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "image-cache",
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === "font",
    handler: "CacheFirst",
    options: {
      cacheName: "font-cache",
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  ...runtimeCaching,
];

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: customRuntimeCaching,
  fallbacks: {
    document: "/offline.html",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
