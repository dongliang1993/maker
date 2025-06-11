'use client'

import { Flex } from '@radix-ui/themes'
import { Sidebar } from '@/components/Sidebar'
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
      <main style={{ width: '100%' }}>{children}</main>
    </Flex>
  )
}
