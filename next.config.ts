import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 文章以 blog/<slug>/ 目录形式随仓库存储、运行时读取，部署时需一并打包
  outputFileTracingIncludes: {
    "/blog/**": ["./blog/**"],
    "/feed.xml": ["./blog/**"],
  },
};

export default nextConfig;
