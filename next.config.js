import nextPWA from 'next-pwa';       
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        dns: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig);
