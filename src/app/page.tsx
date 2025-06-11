import {
  Container,
  Heading,
  Text,
  Grid,
  Card,
  Flex,
  Avatar,
  Button,
} from '@radix-ui/themes'

export default function Home() {
  return (
    <Container size='4' p='6'>
      <Flex direction='column' gap='8'>
        {/* 头部区域 */}
        <Flex direction='column' align='center' gap='4'>
          <Heading size='9' align='center'>
            Next.js + Radix UI
          </Heading>
          <Text
            size='5'
            color='gray'
            align='center'
            style={{ maxWidth: '700px' }}
          >
            使用 Radix UI Themes 构建现代化的 Web 应用
          </Text>
        </Flex>

        {/* Avatar 展示区域 */}
        <Card size='3'>
          <Flex direction='column' gap='4'>
            <Heading size='4'>Avatar 组件示例</Heading>
            <Flex gap='4' align='center' wrap='wrap'>
              <Avatar
                size='5'
                src='https://github.com/shadcn.png'
                fallback='CN'
                radius='full'
              />
              <Avatar
                size='3'
                src='https://github.com/radix-ui.png'
                fallback='RU'
                radius='full'
              />
              <Avatar size='7' fallback='测试' radius='full' color='blue' />
            </Flex>
          </Flex>
        </Card>

        {/* 特性卡片网格 */}
        <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap='6'>
          {/* 特性卡片 1 */}
          <Card size='3'>
            <Flex direction='column' gap='4'>
              <Flex gap='3' align='center'>
                <Avatar
                  size='3'
                  src='https://github.com/shadcn.png'
                  fallback='UI'
                  radius='full'
                />
                <Heading size='3'>现代化设计</Heading>
              </Flex>
              <Text color='gray' size='2'>
                使用 Radix UI Themes 构建优雅的用户界面
              </Text>
              <Button variant='soft' size='2'>
                了解更多
              </Button>
            </Flex>
          </Card>

          {/* 特性卡片 2 */}
          <Card size='3'>
            <Flex direction='column' gap='4'>
              <Flex gap='3' align='center'>
                <Avatar
                  size='3'
                  src='https://github.com/radix-ui.png'
                  fallback='RX'
                  radius='full'
                />
                <Heading size='3'>组件驱动</Heading>
              </Flex>
              <Text color='gray' size='2'>
                可重用的组件系统，提高开发效率
              </Text>
              <Button variant='soft' size='2'>
                查看组件
              </Button>
            </Flex>
          </Card>

          {/* 特性卡片 3 */}
          <Card size='3'>
            <Flex direction='column' gap='4'>
              <Flex gap='3' align='center'>
                <Avatar size='3' fallback='DM' radius='full' color='blue' />
                <Heading size='3'>深色模式</Heading>
              </Flex>
              <Text color='gray' size='2'>
                内置深色模式支持，提升用户体验
              </Text>
              <Button variant='soft' size='2'>
                切换主题
              </Button>
            </Flex>
          </Card>
        </Grid>

        {/* 底部按钮 */}
        <Flex gap='4' justify='center'>
          <Button size='3'>开始使用</Button>
          <Button size='3' variant='outline'>
            查看文档
          </Button>
        </Flex>
      </Flex>
    </Container>
  )
}
