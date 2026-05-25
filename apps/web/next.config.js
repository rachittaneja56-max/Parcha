/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/trpc";
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:8000/api";

    return [
      {
        source: "/trpc/:path*",
        destination: `${apiUrl}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
