import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const BACKEND_URL = process.env.BACKEND_URL || (isProd
  ? 'https://decoration-3un1.onrender.com'
  : 'http://localhost:5000');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: `${BACKEND_URL}/api/admin/:path*`,
      },
      {
        source: '/api/public/:path*',
        destination: `${BACKEND_URL}/api/public/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
