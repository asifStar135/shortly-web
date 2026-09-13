import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/:shortCode",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/url/get/:shortCode`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
