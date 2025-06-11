'use client'

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
  Link2Icon,
  GlobeIcon,
  GridIcon,
  ImageIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import { ResizablePanel } from '@/components/ResizablePanel'
import { useRef, useState, useEffect } from 'react'
import { useUploadImage } from '@/lib/queries'

interface Message {
  id: string
  type: 'text' | 'image'
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

// 从 localStorage 加载消息
const loadMessages = (): Message[] => {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('chat-messages')
  return saved ? JSON.parse(saved) : []
}

// 保存消息到 localStorage
const saveMessages = (messages: Message[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('chat-messages', JSON.stringify(messages))
}

export default function CanvasPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { mutate: uploadImage, isPending: isUploading } = useUploadImage()

  // 初始化加载消息
  useEffect(() => {
    const savedMessages = loadMessages()
    if (savedMessages.length === 0) {
      // 如果没有保存的消息，添加欢迎消息
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'text',
        content:
          '你好！我是你的 AI 助手，请告诉我你想要对图片进行什么样的处理？',
        role: 'assistant',
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
      saveMessages([welcomeMessage])
    } else {
      setMessages(savedMessages)
    }
  }, [])

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: inputValue,
      role: 'user',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    uploadImage(file, {
      onSuccess: (result) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'image',
          content: result.url,
          role: 'user',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, newMessage])
      },
      onError: (error) => {
        console.error('上传图片失败:', error)
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: 'text',
          content: '图片上传失败，请重试',
          role: 'assistant',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMessage])
      },
      onSettled: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
    })
  }

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
              ref={scrollAreaRef}
              style={{
                flex: 1,
                padding: '20px',
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  mb='4'
                  style={{
                    display: 'flex',
                    justifyContent:
                      message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      backgroundColor:
                        message.role === 'user'
                          ? 'var(--accent-9)'
                          : 'var(--gray-3)',
                      borderRadius: 'var(--radius-4)',
                      color: message.role === 'user' ? '#fff' : 'inherit',
                    }}
                  >
                    {message.type === 'text' ? (
                      <Text size='2'>{message.content}</Text>
                    ) : (
                      <img
                        src={message.content}
                        alt='上传的图片'
                        style={{
                          maxWidth: '100%',
                          borderRadius: 'var(--radius-3)',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </ScrollArea>

            {/* 输入区域 */}
            <Box
              p='4'
              style={{
                border: '1px solid var(--gray-a4)',
                borderRadius: 'var(--radius-5)',
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'var(--color-background)',
              }}
            >
              <Flex direction='column' gap='3'>
                <TextArea
                  placeholder='请输入你的设计要求...'
                  variant='surface'
                  rows={3}
                  style={{
                    border: '0',
                  }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Flex gap='2' justify='between' align='center'>
                  <Flex gap='2'>
                    <input
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <Button
                      variant='surface'
                      size='1'
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <UpdateIcon
                          width='14'
                          height='14'
                          className='animate-spin'
                        />
                      ) : (
                        <ImageIcon width='14' height='14' />
                      )}
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
                  <Button size='2' onClick={handleSendMessage}>
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
