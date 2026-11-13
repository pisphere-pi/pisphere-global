/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://sdk.minepi.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://socialchain.app",
              "frame-ancestors 'self' https://*.pinet.com https://*.minepi.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
