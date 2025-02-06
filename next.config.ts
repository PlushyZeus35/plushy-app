import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 No bloquea el build si hay errores de ESLint
  },
};

export default nextConfig;
