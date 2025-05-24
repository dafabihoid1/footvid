// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...any other options you already had...

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        dns: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig
