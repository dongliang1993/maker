'use client'

import { Box, ScrollArea, Flex, Button, Text } from '@radix-ui/themes'
import { HomeIcon, FilePlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <Box
      px='4'
      py='6'
      style={{
        height: '100vh',
        borderRight: '1px solid var(--gray-a5)',
        position: 'sticky',
        top: 0,
        width: 200,
        backgroundColor: 'var(--gray-1)',
      }}
    >
      <ScrollArea>
        <Flex direction='column' gap='2'>
          <Link href='/' passHref style={{ width: '100%' }}>
            <Button
              variant={isActive('/') ? 'soft' : 'ghost'}
              color={isActive('/') ? 'iris' : 'gray'}
              style={{
                width: '100%',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <HomeIcon width='16' height='16' />
              <Text size='2'>首页</Text>
            </Button>
          </Link>

          <Link href='/projects' passHref style={{ width: '100%' }}>
            <Button
              variant={isActive('/projects') ? 'soft' : 'ghost'}
              color={isActive('/projects') ? 'iris' : 'gray'}
              style={{
                width: '100%',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <FilePlusIcon width='16' height='16' />
              <Text size='2'>项目</Text>
            </Button>
          </Link>
        </Flex>
      </ScrollArea>
    </Box>
  )
}
