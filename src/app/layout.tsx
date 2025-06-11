'use client'

import '@radix-ui/themes/styles.css'
import './globals.css'
import { Providers } from '@/components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
