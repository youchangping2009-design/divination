/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/": ["./lib/data/zhouyi/**/*"],
  },
};

module.exports = nextConfig;
