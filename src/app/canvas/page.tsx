'use client'

import { ResizablePanel } from '@/components/ResizablePanel'
import { Card, Flex } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

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
      <Flex
        direction='row'
        width='100%'
        height='100vh'
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 左侧画布区域 */}
        <Flex
          style={{
            flex: 1,
            height: '100%',
          }}
        >
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
            <CanvasPlayground />
          </Card>
        </Flex>

        <div className='z-50 right-0 absolute top-0 bottom-0 max-w-[600] overflow-y-auto bg-white'>
          {/* 右侧聊天区域 */}
          <ResizablePanel>
            {(width) => (
              <Flex
                direction='column'
                className='px-6 pt-2 pb-14 border-l border-gray-200 h-full w-full'
                style={{
                  width,
                }}
              >
                <ChatList loading={loading} />
              </Flex>
            )}
          </ResizablePanel>
        </div>
      </Flex>
      <ChatBox projectId={projectId} />
    </ChatProvider>
  )
}
