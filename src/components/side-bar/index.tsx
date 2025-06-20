'use client'

import { Flex } from '@radix-ui/themes'
import { Box as BoxIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from './side-bar-Item'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <Flex
      className='px-3 py-3'
      direction='column'
      gap='2'
      style={{
        width: '220px',
        height: '100vh',
        borderRight: '1px solid var(--gray-a4)',
        boxShadow: '0 0 5px 0 var(--gray-a4)',
      }}
    >
      <SidebarItem
        icon={<BoxIcon width='24' height='24' />}
        label='Projects'
        href='/projects'
        isActive={isActive('/projects')}
      />
    </Flex>
  )
}
