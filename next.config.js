/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [{ source: "/qian", destination: "/", permanent: true }];
  },
};

module.exports = nextConfig;
