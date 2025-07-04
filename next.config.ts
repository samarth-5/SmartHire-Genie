// next.config.ts
import type { NextConfig } from 'next';

/**
 * Tell Next.js “don’t bundle pdf‑parse or its pdfjs peer;
 * load them with native `require()` at runtime”.
 */
const nextConfig: NextConfig = {
  // Next 15+ (stable)
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],

  // Next 14 only – keep until you fully migrate off 14.x
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  },
};

export default nextConfig;
