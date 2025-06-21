import {
  Box,
  Container,
  Flex,
  Heading,
  ScrollArea,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { Image as AntdImage } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/logo'
import { getModelNameByToolName } from '@/constants/model'
import { useScrollToBottom } from '@/hooks/useScrollToBottom'
import { UIMessage, useChatStore } from '@/lib/use-chat'
import { isImageTool, sanitizeText } from '@/lib/utils'
import { Markdown } from '../markdown'
import { Image, ImageSkeleton } from './image'
import { ThinkingMessage } from './thinking-message'

type ChatListProps = {
  projectId?: string
  loading: boolean
}

export const ChatList: React.FC<ChatListProps> = ({ loading }) => {
  const messages = useChatStore((state) => state.messages)
  const status = useChatStore((state) => state.status)
  const [previewImage, setPreviewImage] = useState<{
    visible: boolean
    imageUrl: string
  }>({
    visible: false,
    imageUrl: '',
  })
  const {
    containerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    scrollToBottom,
  } = useScrollToBottom()

  console.log(messages, status, 'messages')

  const handlePreviewImage = (imageUrl: string) => {
    setPreviewImage({
      visible: true,
      imageUrl,
    })
  }

  const renderUIMessage = (msg: UIMessage) => {
    if (msg.role === 'assistant') {
      return (
        <Container key={msg.id}>
          <Logo size={2} className='mb-2' />
          <Flex direction='column' gap='5'>
            {msg.parts.map((part, index) => {
              const key = `message-part-${index}`
              const { type } = part

              if (type === 'tool-invocation') {
                const toolName = part.toolInvocation.toolName
                const state = part.toolInvocation.state
                // @ts-expect-error: todo add type conversion from ToolInvocation to ToolInvocationUIPart
                const imageUrl = part.toolInvocation?.result?.imageUrl

                return (
                  <Box
                    key={key}
                    className='rounded-md py-3 px-4 gap-2'
                    style={{
                      borderRadius: 'var(--radius-6)',
                      background: 'rgb(241, 245, 235)',
                    }}
                  >
                    <Box>
                      <span
                        className='inline-flex mb-3 px-4 rounded-2xl font-bold text-sm box-border bg-white leading-7'
                        style={{
                          color: 'rgb(136, 168, 87)',
                        }}
                      >
                        {getModelNameByToolName(toolName)}
                      </span>
                    </Box>
                    {isImageTool(toolName) && state === 'call' && (
                      <>
                        <Heading
                          size='2'
                          style={{
                            marginBottom: 'var(--space-3)',
                          }}
                        >
                          {getModelNameByToolName(toolName)} is making...
                        </Heading>
                        <ImageSkeleton />
                      </>
                    )}

                    {imageUrl && (
                      <Image
                        key={imageUrl}
                        alt='image'
                        url={imageUrl}
                        onPreview={handlePreviewImage}
                      />
                    )}
                  </Box>
                )
              }

              if (type === 'text') {
                return (
                  <Box
                    key={key}
                    className='rounded-md py-3 px-4 gap-2 pr-4 max-w-[80%]'
                    style={{
                      borderRadius: 'var(--radius-6)',
                      background:
                        'linear-gradient(90deg,#f5f5f5 0%,#fbfbfb 100%)',
                    }}
                  >
                    <Markdown>{sanitizeText(part?.text ?? '')}</Markdown>
                  </Box>
                )
              }
            })}
          </Flex>
        </Container>
      )
    }

    return (
      <div className='flex justify-end w-full' key={msg.id}>
        <div
          className='py-3 px-4 bg-[#4A535F] text-white max-w-[80%]'
          style={{
            borderRadius: 'var(--radius-6)',
          }}
        >
          <Text
            size='2'
            className='cursor-text'
            style={{
              fontSize: '16px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {msg.content}
          </Text>
          {msg.image_list?.map((image) => (
            <Box style={{ marginTop: '8px' }} key={image.imageUrl}>
              <Image url={image.imageUrl} alt='image' />
            </Box>
          ))}
        </div>
      </div>
    )
  }

  useEffect(() => {
    scrollToBottom()
  }, [status, scrollToBottom])

  return (
    <ScrollArea
      scrollbars='vertical'
      type='hover'
      className='relative px-6 pt-4 border-l border-gray-200 h-full w-full'
      ref={containerRef}
    >
      <Flex direction='column' gap='5'>
        {loading ? (
          <Flex
            justify='center'
            align='center'
            height='100%'
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          >
            <Spinner size='3' />
          </Flex>
        ) : messages.length === 0 ? (
          <Text size='2' color='gray'>
            暂无消息
          </Text>
        ) : (
          messages.map(renderUIMessage)
        )}

        {status === 'submitted' &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

        <motion.div
          ref={messagesEndRef}
          className='shrink-0 min-w-[24px] h-[24px]'
          onViewportLeave={onViewportLeave}
          onViewportEnter={onViewportEnter}
        />
      </Flex>
      <AntdImage
        style={{ display: 'none' }}
        src={previewImage.imageUrl}
        alt='preview image'
        preview={{
          visible: previewImage.visible,
          src: previewImage.imageUrl,
          onVisibleChange: (value) => {
            setPreviewImage({
              visible: value,
              imageUrl: previewImage.imageUrl,
            })
          },
        }}
      />
    </ScrollArea>
  )
}
