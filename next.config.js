/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 关键配置：启用静态导出
  images: {
    unoptimized: true, // 禁用图片优化，适配静态部署
  },
}

module.exports = nextConfig
