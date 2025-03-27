import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth", // Ganti dengan halaman form tujuan
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
