/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // leave empty unless you have a custom port
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
