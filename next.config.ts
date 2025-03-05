import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
  ],
}

export default nextConfig
