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
  async redirects() {
    return [
      {
        source: '/api/:path*', // Match any API route
        has: [
          {
            type: 'host',
            value: 'http://newsapp-najw.onrender.com', // Match any http request to the host
          },
        ],
        destination: 'https://newsapp-najw.onrender.com/api/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
