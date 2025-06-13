'use client'

import { ResizablePanel } from '@/components/ResizablePanel'
import { Card, Flex, Text } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ChatBox, ChatList } from '@/components/chat'
import { getDatabase } from '@/database'

import type { Message } from '@/database/types'

// 从 localStorage 加载消息
const loadMessages = async (projectId: string): Promise<Message[]> => {
  const db = getDatabase('client')
  const { data, error } = await db.messages.findByProject(projectId)
  if (error) {
    console.error(error)
    return []
  }

  return data as Message[]
}

// 保存消息到 localStorage
const saveMessages = (messages: Message[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('chat-messages', JSON.stringify(messages))
}

export default function CanvasPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // projectId 从 url 中获取
  const projectId = useSearchParams().get('projectId') || ''

  // 初始化加载消息
  useEffect(() => {
    const run = async () => {
      if (!projectId) return
      const savedMessages = await loadMessages(projectId)
      if (savedMessages.length === 0) {
      } else {
        setMessages(savedMessages)
      }
    }

    run()
  }, [projectId])

  // 当消息更新时保存到 localStorage
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollAreaRef.current) {
      const element = scrollAreaRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [messages])

  return (
    <>
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
            className='px-6 pt-4 border-l border-gray-200 h-full w-full'
          >
            <ChatList projectId={projectId} />
          </Flex>
        </ResizablePanel>
      </Flex>
      <ChatBox projectId={projectId} />
    </>
  )
}
