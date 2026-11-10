import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The screens are static pages with client forms; nothing needs a server at runtime yet.
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
