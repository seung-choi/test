import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vgolf FNB",
    short_name: "Vgolf",
    description: "Vgolf FNB Admin",
    lang: "ko",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#F2F8FF",
    theme_color: "#6600FF",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
