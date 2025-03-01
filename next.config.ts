import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 No bloquea el build si hay errores de ESLint
  },
  env: {
    STRAPI_API_KEY: process.env.STRAPI_API_KEY, // 🔑 API Key de Strapi
  }
};

export default nextConfig;
