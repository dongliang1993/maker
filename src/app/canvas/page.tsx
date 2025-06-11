import {
  Heading,
  Text,
  Card,
  Flex,
  Button,
  TextArea,
  ScrollArea,
  Box,
} from '@radix-ui/themes'
import {
  PaperPlaneIcon,
  PlusIcon,
  Link2Icon,
  GlobeIcon,
  GridIcon,
} from '@radix-ui/react-icons'
import { ResizablePanel } from '@/components/ResizablePanel'

export default function CanvasPage() {
  return (
    <Flex
      direction='column'
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* 顶部导航 */}
      <Flex align='center' justify='center' py='3' className='bg-white'>
        <Heading size='5' weight='medium'>
          transform-images
        </Heading>
      </Flex>

      {/* 主要内容区域 */}
      <Flex
        style={{
          flex: 1,
          overflow: 'hidden',
          border: '1px solid var(--gray-a4)',
        }}
      >
        {/* 左侧画布区域 */}
        <Flex
          direction='column'
          style={{
            flex: 1,
            height: '100%',
          }}
        >
          {/* 画布区域 */}
          <Card
            size='2'
            style={{
              flex: 1,
              border: '1px dashed var(--gray-a8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size='3' color='gray' align='center'>
              拖放图片到这里
              <br />
              或点击上传
            </Text>
          </Card>
        </Flex>

        {/* 右侧聊天区域 */}
        <ResizablePanel>
          <Flex
            direction='column'
            style={{
              height: '100%',
              width: '100%',
              borderLeft: '1px solid var(--gray-a4)',
            }}
          >
            {/* 聊天记录区域 */}
            <ScrollArea
              style={{
                flex: 1,
                padding: '20px',
              }}
            >
              {/* 系统消息 */}
              <Text as='p' size='2' color='gray' mb='4'>
                你好！我是你的 AI 助手，请告诉我你想要对图片进行什么样的处理？
              </Text>
            </ScrollArea>

            {/* 输入区域 */}
            <Box p='4' style={{ borderTop: '1px solid var(--gray-a4)' }}>
              <Flex direction='column' gap='3'>
                <TextArea
                  placeholder='请输入你的设计要求...'
                  variant='surface'
                  rows={3}
                />
                <Flex gap='2' justify='between' align='center'>
                  <Flex gap='2'>
                    <Button variant='surface' size='1'>
                      <PlusIcon width='14' height='14' />
                    </Button>
                    <Button variant='surface' size='1'>
                      <Link2Icon width='14' height='14' />
                    </Button>
                    <Button variant='surface' size='1'>
                      <GlobeIcon width='14' height='14' />
                    </Button>
                    <Button variant='surface' size='1'>
                      <GridIcon width='14' height='14' />
                    </Button>
                  </Flex>
                  <Button size='2'>
                    <PaperPlaneIcon width='16' height='16' />
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </ResizablePanel>
      </Flex>
    </Flex>
  )
}
