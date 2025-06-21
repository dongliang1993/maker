'use client'

import { Flex } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ResizablePanel } from '@/components/ResizablePanel'
import { CanvasPlayground } from '@/components/canvas'
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
      generateId: uuidv4,
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
      {/* 画布区域 */}
      <Flex
        direction='row'
        width='100%'
        height='100vh'
        style={{
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#F8F7F7',
        }}
      >
        <CanvasPlayground />
      </Flex>

      {/* 右侧聊天区域 */}
      <ResizablePanel
        id='agent-panel'
        className='absolute z-50 right-0 top-0 bottom-0 max-w-[600]'
        defaultWidth={380}
        maxWidth={380}
      >
        <Flex direction='column' className='border-l border-gray-100 bg-white'>
          <ChatList loading={loading} />
        </Flex>
      </ResizablePanel>
      <ChatBox projectId={projectId} />
    </ChatProvider>
  )
}
