import type { NextConfig } from "next";

<<<<<<< HEAD
const isProd = process.env.NODE_ENV === 'production';
const BACKEND_URL = isProd
  ? 'https://decoration-3un1.onrender.com'
  : 'http://localhost:5000';
=======
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
>>>>>>> 32feaf01062f3b0ca1cfc0343be7443a6a1a56dd

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
<<<<<<< HEAD
        destination: `${BACKEND_URL}/api/admin/:path*`,
      },
      {
        source: '/api/public/:path*',
        destination: `${BACKEND_URL}/api/public/:path*`,
=======
        destination: `${backendUrl}/api/admin/:path*`,
      },
      {
        source: '/api/public/:path*',
        destination: `${backendUrl}/api/public/:path*`,
>>>>>>> 32feaf01062f3b0ca1cfc0343be7443a6a1a56dd
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
