/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for Dynamic.xyz and wallet connector issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      url: 'url',
      zlib: 'browserify-zlib',
      http: 'stream-http',
      https: 'https-browserify',
      assert: 'assert',
      os: 'os-browserify/browser',
      path: 'path-browserify',
    };

    // Handle pino-pretty optional dependency
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push('pino-pretty');
    }

    return config;
  },
  transpilePackages: [
    '@dynamic-labs/sdk-react-core',
    '@dynamic-labs/ethereum',
    '@dynamic-labs/solana',
  ],
};

export default nextConfig;
