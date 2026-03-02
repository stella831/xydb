import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '督办系统',
  description: '一个简单的督办管理系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
