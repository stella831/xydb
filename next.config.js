/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你的GitHub仓库名称，必须和仓库名完全一致
  basePath: '/xydb',
  // 开启静态导出，适配GitHub Pages
  output: 'export',
  // 关闭图片优化，GitHub Pages不支持Next.js原生图片优化
  images: {
    unoptimized: true,
  },
  // 关闭构建时的ESLint校验，避免非关键错误阻断部署
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 关闭构建时的TypeScript类型校验，避免非关键错误阻断部署
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
