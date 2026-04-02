import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.xendit.co https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https: http:",
      "font-src 'self' data:",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.xendit.co",
      "connect-src 'self' https://api.stripe.com https://checkout.xendit.co wss:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  transpilePackages: ["geist"],
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {},
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  webpack(config) {
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      async_hooks: false,
      fs: false,
      path: false,
    };

    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
