'use client'

import { Sidebar } from '@/components/side-bar'
import { Flex } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCanvasPage = pathname?.startsWith('/canvas')

  if (isCanvasPage) {
    return children
  }

  return (
    <Flex>
      <Sidebar />
      <Flex flexGrow='1'>
        <main style={{ width: '100%' }}>{children}</main>
      </Flex>
    </Flex>
  )
}
