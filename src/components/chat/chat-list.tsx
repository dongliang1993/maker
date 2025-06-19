import {
  Avatar,
  Box,
  Container,
  Flex,
  ScrollArea,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { useEffect } from 'react'

import { Logo } from '@/components/logo'
import { sanitizeText } from '@/lib/utils'
import { Markdown } from '../markdown'

import { UIMessage, useChatStore } from '@/lib/use-chat'

type ChatListProps = {
  projectId?: string
  loading: boolean
}

export const ChatList: React.FC<ChatListProps> = ({ loading }) => {
  const messages = useChatStore((state) => state.messages)

  console.log(messages, 'messages')

  const messagesLength = messages.length

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
                // @ts-expect-error: todo add type conversion from ToolInvocation to ToolInvocationUIPart
                const imageUrl = part.toolInvocation?.result?.imageUrl

                return (
                  <Box
                    key={key}
                    className='rounded-md py-3 px-4 gap-2'
                    style={{
                      background: 'rgb(241, 245, 235)',
                    }}
                  >
                    <span
                      className='inline-flex mb-3 px-4 rounded-2xl font-bold text-sm box-border bg-white leading-7'
                      style={{
                        color: 'rgb(136, 168, 87)',
                      }}
                    >
                      {toolName}
                    </span>
                    {imageUrl && (
                      <Box key={imageUrl}>
                        <Avatar
                          size='9'
                          src={imageUrl}
                          radius='small'
                          fallback='IMG'
                          className='cursor-pointer hover:scale-110 transition-all duration-300'
                        />
                      </Box>
                    )}
                  </Box>
                )
              }

              if (type === 'text') {
                return (
                  <Box
                    key={key}
                    className='rounded-md py-3 px-4 gap-2'
                    style={{
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
        <div className='rounded-md py-3 px-4 bg-[#4A535F] text-white'>
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
              <Avatar
                size='7'
                src={image.imageUrl}
                radius='medium'
                fallback='IMG'
                className='cursor-pointer hover:scale-110 transition-all duration-300'
              />
            </Box>
          ))}
        </div>
      </div>
    )
  }

  useEffect(() => {
    // 聊天框滚动到最底部
    const chatList = document.getElementById('chat-list')

    if (chatList) {
      // 加上过渡效果
      chatList.scrollTop = chatList.scrollHeight
      chatList.style.transition = 'all 0.3s ease-in-out'
    }
  }, [messagesLength])

  return (
    <ScrollArea
      scrollbars='vertical'
      type='hover'
      id='chat-list'
      className='relative'
      style={{
        // @ts-expect-error 忽略类型错误
        '--radix-scroll-area-thumb-width': '0px',
        '--radix-scrollbar-hover-width': '0px',
        '--radix-scrollbar-hover-color': 'rgba(0, 0, 0, 0.1)',
      }}
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
      </Flex>
    </ScrollArea>
  )
}
