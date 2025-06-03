import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // 구글
      'ssl.pstatic.net', // 네이버
      'k.kakaocdn.net', // 카카오
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
