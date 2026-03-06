/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启静态导出，必加！否则不会生成out文件夹
  output: 'export',
  // 配置GitHub Pages仓库名作为基础路径，你的仓库是xydb，所以填/xydb
  basePath: '/xydb',
  // 关闭图片优化，静态导出不支持默认的图片优化
  images: {
    unoptimized: true,
  },
  // 关闭严格模式，避免不必要的构建报错
  reactStrictMode: false,
}

module.exports = nextConfig
