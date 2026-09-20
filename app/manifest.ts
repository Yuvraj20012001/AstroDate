import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Soulmate Score",
    short_name: "Soulmate",
    description: "See your compatibility with everyone here — by love, by chemistry, by vibe.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6e9ff",
    theme_color: "#a855f7",
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
  };
}
