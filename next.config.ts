import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all https images (needed for Vercel Blob and external winery links)
      },
    ],
    formats: ['image/avif', 'image/webp'], // Enable modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Common breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnail sizes
  },
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
};

export default nextConfig;
