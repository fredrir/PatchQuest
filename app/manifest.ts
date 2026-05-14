import type { MetadataRoute } from "next";

import { BRAND_BG_DARK, BRAND_BLUE, SITE_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PatchQuest · TDT4237 practice",
    short_name: "PatchQuest",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND_BG_DARK,
    theme_color: BRAND_BLUE,
    categories: ["education", "productivity"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon3.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image.png",
        sizes: "1893x898",
        type: "image/png",
        label: "Screenshot of the app",
      },
    ],
  };
}
