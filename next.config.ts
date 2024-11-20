import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: 'incremental',
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: 'https://stackoverflow.com/posts/66662033',
  //       permanent: false,
  //       basePath: false
  //     },
  //   ]
  // },
};

export default nextConfig;
