import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isGitHubPages =
  process.env.GITHUB_PAGES !== "false" &&
  (isProd || process.env.GITHUB_ACTIONS === "true");
const basePath = isGitHubPages ? "/hiddengem-ai" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
