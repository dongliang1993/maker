import {
  Container,
  Heading,
  Grid,
  Card,
  Text,
  Flex,
  Button,
} from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'

// 模拟项目数据
const projects = [
  {
    id: 1,
    name: 'transform-images',
    description: '图片转换工具',
    lastModified: '2024-01-11',
  },
  {
    id: 2,
    name: 'my-project',
    description: '个人项目',
    lastModified: '2024-01-10',
  },
]

export default function ProjectsPage() {
  return (
    <Container size='4' p='6'>
      <Flex direction='column' gap='6'>
        <Flex justify='between' align='center'>
          <Heading size='6'>项目列表</Heading>
          <Button size='3'>
            <PlusIcon width='16' height='16' />
            <Text ml='2'>新建项目</Text>
          </Button>
        </Flex>

        <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap='4'>
          {/* 新建项目卡片 */}
          <Card size='3' style={{ cursor: 'pointer' }}>
            <Flex
              direction='column'
              align='center'
              justify='center'
              gap='4'
              style={{ height: '200px' }}
            >
              <PlusIcon width='32' height='32' />
              <Text size='2' color='gray'>
                创建新项目
              </Text>
            </Flex>
          </Card>

          {/* 项目列表 */}
          {projects.map((project) => (
            <Card key={project.id} size='3' style={{ cursor: 'pointer' }}>
              <Flex direction='column' gap='3'>
                <Heading size='4'>{project.name}</Heading>
                <Text as='p' color='gray' size='2'>
                  {project.description}
                </Text>
                <Text size='1' color='gray'>
                  最后修改于 {project.lastModified}
                </Text>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  )
}
