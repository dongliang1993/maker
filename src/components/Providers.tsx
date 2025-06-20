'use client'

import { Theme } from '@radix-ui/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { RootLayoutContent } from './RootLayoutContent'

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 分钟
            retry: 1,
          },
        },
      })
  )

  return (
    <Theme
      appearance='light'
      accentColor='gray'
      grayColor='gray'
      panelBackground='solid'
      scaling='100%'
      radius='medium'
    >
      <QueryClientProvider client={queryClient}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </QueryClientProvider>
    </Theme>
  )
}
