import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};


// In your next.config.js
module.exports = {
  experimental: {
    turbopack: {
      // Try disabling font optimization if needed
      optimizeFonts: false,
    }
  }
}

export default nextConfig;
