/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for production
  poweredByHeader: false,
  
  // Image optimization for property photos
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'lh3.googleusercontent.com', // Google profile photos
    ],
  },
  
  // Environment variables exposed to client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Get Listings',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Redirect root to dashboard
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Allow Facebook webhook callbacks
      {
        source: '/api/leads/facebook',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
