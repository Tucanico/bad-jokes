/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Only our own Cloudinary folder, so the optimizer can't be pointed at anyone else's images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dtl48kr1u/**",
      },
    ],
  },
};

module.exports = nextConfig;
