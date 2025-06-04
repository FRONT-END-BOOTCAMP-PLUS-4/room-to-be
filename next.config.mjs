import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'ssl.pstatic.net',
      'k.kakaocdn.net',
      'phinf.pstatic.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ttlrzfyxsvqbmlffebqi.supabase.co',
        pathname: '/storage/v1/object/public/r2b/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
