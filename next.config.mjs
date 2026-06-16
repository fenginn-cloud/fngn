/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    // Allow production builds to complete even if there are lint warnings.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
