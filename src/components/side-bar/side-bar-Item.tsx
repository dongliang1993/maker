import { Box, Button } from '@radix-ui/themes'
import Link from 'next/link'

export const SidebarItem = ({
  icon,
  label,
  href,
  isActive,
}: {
  icon: React.ReactNode
  label: string
  href: string
  isActive: boolean
}) => {
  return (
    <Link href={href} passHref style={{ width: '100%' }} className='px-1 py-1'>
      <Button
        variant={isActive ? 'soft' : 'ghost'}
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          padding: 'var(--space-1)',
          height: '40px',
          borderRadius: 'var(--radius-6)',
          boxShadow: 'none',
        }}
      >
        <Box as='span' className='bg-white px-1 py-1 rounded-xl mr-1'>
          {icon}
        </Box>
        {label}
      </Button>
    </Link>
  )
}
