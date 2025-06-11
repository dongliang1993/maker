'use client'

import { Theme } from '@radix-ui/themes'
import { RootLayoutContent } from './RootLayoutContent'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme
      appearance='light'
      accentColor='gray'
      grayColor='gray'
      panelBackground='solid'
      scaling='100%'
      radius='medium'
    >
      <RootLayoutContent>{children}</RootLayoutContent>
    </Theme>
  )
}
