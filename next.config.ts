import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
  // v15‑plus – opt specific Node‑only deps out of RSC bundling
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],

  images: {
    domains: ['lh3.googleusercontent.com'],
  },

  // Optional: let the build continue even if eslint finds warnings,
  // remove if you prefer the default “fail on error” behaviour.
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
