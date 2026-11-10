/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Content-Security-Policy",
            value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors 'self' https://*.minepi.com https://*.piappengine.com https://app-cdn.minepi.com;"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
Displaying 1000467041.png. 
