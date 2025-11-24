import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration options
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001",
        "https://nest.virsd.com",
      ],
    },
  },
};

export default nextConfig;
