import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // 如果部署到 https://<username>.github.io/<repo-name>/，请取消注释并替换为你的仓库名称
  // basePath: '/repo-name'
};

export default nextConfig;
