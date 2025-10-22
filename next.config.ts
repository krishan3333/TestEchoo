import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Add Clerk's image hostname
        port: '',
        pathname: '**'
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'api.dicebear.com',
  //       port: '',
  //       pathname: '**',
      },
      { // Add this new entry for Brave Search images
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        port: '',
        pathname: '**',
      },
    ],
  },

};

export default nextConfig;
