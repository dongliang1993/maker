'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { Box, Card, Flex, Grid, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import Link from 'next/link'

import { useProjectList } from '@/services/project'

export default function ProjectsPage() {
  const { data: projects } = useProjectList()

  console.log('projects', projects)
  return (
    <Box
      p='8'
      style={{
        backgroundColor: '#fafafa',
        backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        height: '100%',
      }}
    >
      <Flex direction='column' gap='6'>
        <Grid columns={{ initial: '1', sm: '3', lg: '4' }} gap='4'>
          {/* 新建项目卡片 */}
          <Link href='/canvas' style={{ textDecoration: 'none' }}>
            <Card size='2' className='hover:shadow-md'>
              <Flex
                direction='column'
                align='center'
                justify='center'
                gap='4'
                style={{
                  height: '160px',
                }}
              >
                <PlusIcon width='32' height='32' />
                <Text size='2' color='gray' weight='medium'>
                  创建新项目
                </Text>
              </Flex>
            </Card>
          </Link>

          {/* 项目列表 */}
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/canvas?projectId=${project.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card size='2' className='hover:shadow-md'>
                <Flex
                  direction='column'
                  justify='end'
                  gap='2'
                  style={{
                    height: '160px',
                  }}
                >
                  <Text as='p' className='text-black' size='2' weight='medium'>
                    {project.name}
                  </Text>
                  <Text size='1' color='gray'>
                    {format(project.updated_at, 'MM-dd HH:mm, yyyy')}
                  </Text>
                </Flex>
              </Card>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Box>
  )
}
