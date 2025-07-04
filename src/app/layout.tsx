'use client'

import Header from '@/components/header'
import { LoginModal } from '@/components/login-modal'
import { Providers } from '@/components/Providers'
import { ClerkProvider } from '@clerk/nextjs'
import { Flex } from '@radix-ui/themes'
import { Geist, Geist_Mono } from 'next/font/google'
import { usePathname } from 'next/navigation'

import '@radix-ui/themes/styles.css'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isCanvasRoute = pathname?.startsWith('/canvas')

  return (
    <ClerkProvider>
      <html lang='zh-CN' suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-hidden`}
        >
          <Providers>
            {!isCanvasRoute && <Header />}
            <Flex
              direction='column'
              style={{
                height: 'calc(100vh - 60px)',
                overflow: 'auto',
                paddingTop: isCanvasRoute ? 0 : 'var(--space-5)',
              }}
            >
              {children}
            </Flex>
            <LoginModal />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
