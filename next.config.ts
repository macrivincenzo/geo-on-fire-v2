import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Ensure proper domain handling
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'aibrandtrack.com',
          },
        ],
        destination: 'https://www.aibrandtrack.com',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
