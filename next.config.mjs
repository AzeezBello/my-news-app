/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'newsapp-najw.onrender.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
