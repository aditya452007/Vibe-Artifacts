import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // REQUIRED for Firebase
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,       // REQUIRED for static export
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;

