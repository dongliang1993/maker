'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { Box, Flex, Grid, Heading, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import Link from 'next/link'

import { useProjectList } from '@/services/project'

export default function ProjectsPage() {
  const { data: projects } = useProjectList()

  return (
    <Box
      px='8'
      pb='4'
      style={{
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Heading size='4' style={{ marginBottom: 'var(--space-4)' }}>
        My Projects
      </Heading>
      <Flex direction='column' gap='6'>
        <Grid columns={{ initial: '1', sm: '3', lg: '4' }} gap='4'>
          {/* 新建项目卡片 */}
          <Link href='/canvas' style={{ textDecoration: 'none' }}>
            <Flex
              direction='column'
              align='center'
              justify='center'
              gap='4'
              className='hover:shadow-md hover:scale-102 transition-all duration-300 h-48'
              style={{
                borderRadius: 'var(--radius-6)',
                border: '1px solid var(--gray-a4)',
                boxShadow: '0 0 5px 0 var(--gray-a4)',
              }}
            >
              <PlusIcon width='32' height='32' />
              <Text size='2' color='gray' weight='medium'>
                创建新项目
              </Text>
            </Flex>
          </Link>

          {/* 项目列表 */}
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/canvas?projectId=${project.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Flex
                direction='column'
                justify='end'
                gap='2'
                className='hover:shadow-md hover:scale-102 transition-all duration-300 h-48 px-2 py-4'
                style={{
                  borderRadius: 'var(--radius-6)',
                  border: '1px solid var(--gray-a4)',
                  boxShadow: '0 0 5px 0 var(--gray-a4)',
                }}
              >
                <Text
                  as='p'
                  className='text-black px-2'
                  size='2'
                  weight='medium'
                >
                  {project.name}
                </Text>
                <Text size='1' color='gray' className='px-2'>
                  {format(project.updated_at, 'MM-dd HH:mm, yyyy')}
                </Text>
              </Flex>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Box>
  )
}
