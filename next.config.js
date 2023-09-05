/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  experimental: {
    allowMiddlewareResponseBody: true,
  },
};

module.exports = nextConfig;
