import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zpbocjhftzmchrtukiwt.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
