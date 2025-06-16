'use client'

import { ResizablePanel } from '@/components/ResizablePanel'
import { Card, Flex, Text } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ChatBox, ChatList } from '@/components/chat'
import { ChatProvider } from '@/lib/use-chat'
import { getInitialMessages } from '@/services/message'

import { type UseChatOptions } from '@ai-sdk/react'

export default function CanvasPage() {
  // projectId 从 url 中获取
  const projectId = useSearchParams().get('projectId') || ''
  const [loading, setLoading] = useState(true)

  const [options, setOptions] = useState<UseChatOptions>({
    api: '/api/chat',
    initialMessages: [],
    body: {
      projectId,
      experimental_throttle: 100,
      // generateId: generateUUID,
    },
    // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
    experimental_prepareRequestBody: (body) => {
      const { messages, ...rest } = body
      return {
        message: messages.at(-1),
        ...rest.requestBody,
      }
    },
  })

  // 初始化加载消息
  useEffect(() => {
    const run = async () => {
      try {
        if (!projectId) return
        const savedMessages = (await getInitialMessages(projectId)) || []

        if (savedMessages.length > 0) {
          // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
          setOptions((prev) => {
            return {
              ...prev,
              initialMessages: savedMessages,
            }
          })
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [projectId])

  return (
    <ChatProvider {...options}>
      <Flex
        direction='row'
        width='100%'
        height='100vh'
        style={{
          overflow: 'hidden',
        }}
      >
        {/* 左侧画布区域 */}
        <Flex
          style={{
            flex: 1,
            height: '100%',
          }}
        >
          {/* 画布区域 */}
          <Card
            size='2'
            variant='ghost'
            style={{
              flex: 1,
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
            className='px-6 pt-2 pb-14 border-l border-gray-200 h-full w-full'
          >
            <ChatList loading={loading} />
          </Flex>
        </ResizablePanel>
      </Flex>
      <ChatBox projectId={projectId} />
    </ChatProvider>
  )
}
