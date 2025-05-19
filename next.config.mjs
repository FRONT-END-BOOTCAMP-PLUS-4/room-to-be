/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ttlrzfyxsvqbmlffebqi.supabase.co',
        pathname: '/storage/v1/object/public/r2b/**',
      },
    ],
  },
};

export default nextConfig;
