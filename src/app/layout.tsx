'use client'

import Header from '@/components/header'
import { Providers } from '@/components/Providers'
import { ClerkProvider } from '@clerk/nextjs'
import { Flex } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { Geist, Geist_Mono } from 'next/font/google'

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
  return (
    <ClerkProvider>
      <html lang='zh-CN'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <Header />
            <Flex
              direction='column'
              style={{
                height: '100%',
                paddingTop: '50px',
              }}
            >
              {children}
            </Flex>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
