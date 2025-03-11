import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  experimental: {
    turboMode: false, // Desactiva Turbopack
  },
};


export default nextConfig;
