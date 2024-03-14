/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/products/fall_limited_edition_sneakers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
