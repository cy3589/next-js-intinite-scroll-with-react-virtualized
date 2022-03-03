/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

module.exports = {
  ...nextConfig,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};
