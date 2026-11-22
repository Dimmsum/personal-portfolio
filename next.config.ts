import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/admin", destination: "/admin/posts", permanent: false }];
  },
};

export default nextConfig;
