/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/": ["./lib/data/zhouyi/**/*"],
    "/zhouyi": ["./lib/data/zhouyi/**/*"],
  },
  async redirects() {
    return [{ source: "/qian", destination: "/", permanent: true }];
  },
};

module.exports = nextConfig;
