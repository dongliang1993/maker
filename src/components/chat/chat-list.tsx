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
import { useChatStore } from '@/lib/use-chat'
import { Message } from '@/services/message'

type ChatListProps = {
  projectId?: string
  loading: boolean
}

export const ChatList: React.FC<ChatListProps> = ({ loading }) => {
  // const { data: messages = [] } = useMessages(projectId)
  const messages = useChatStore((state) => state.messages)

  console.log(messages, 'messages')

  const messagesLength = messages.length

  const renderMessage = (msg: Message) => {
    if (msg.role === 'assistant') {
      const isLoading = msg.id.startsWith('temp-loading-')

      return (
        <Container key={msg.id}>
          <Logo size={2} className='mb-2' />
          <Box
            className='rounded-md py-3 px-4'
            style={{
              background: 'linear-gradient(90deg,#f5f5f5 0%,#fbfbfb 100%)',
            }}
          >
            <Text
              size='2'
              className={`cursor-text ${isLoading ? 'animate-pulse' : ''}`}
              style={{
                color: '#2f3640',
                fontSize: '16px',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {isLoading ? (
                <div className='flex items-center space-x-1'>
                  <span>思考中</span>
                  <span className='animate-bounce'>.</span>
                  <span
                    className='animate-bounce'
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                  <span
                    className='animate-bounce'
                    style={{ animationDelay: '400ms' }}
                  >
                    .
                  </span>
                </div>
              ) : (
                msg.content
              )}
            </Text>
            {msg.image_url && (
              <Box style={{ marginTop: '8px' }}>
                <Avatar
                  size='7'
                  src={msg.image_url}
                  radius='medium'
                  fallback='IMG'
                  className='cursor-pointer hover:scale-110 transition-all duration-300'
                />
              </Box>
            )}
          </Box>
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
          {msg.image_url && (
            <Box style={{ marginTop: '8px' }}>
              <Avatar
                size='7'
                src={msg.image_url}
                radius='medium'
                fallback='IMG'
                className='cursor-pointer hover:scale-110 transition-all duration-300'
              />
            </Box>
          )}
        </div>
      </div>
    )
  }

  const renderUIMessage = (msg) => {
    if (msg.role !== 'user') {
      const isLoading = msg.id.startsWith('temp-loading-')

      return (
        <Container key={msg.id}>
          <Logo size={2} className='mb-2' />
          <Box
            className='rounded-md py-3 px-4'
            style={{
              background: 'linear-gradient(90deg,#f5f5f5 0%,#fbfbfb 100%)',
            }}
          >
            <Text
              size='2'
              className={`cursor-text ${isLoading ? 'animate-pulse' : ''}`}
              style={{
                color: '#2f3640',
                fontSize: '16px',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {isLoading ? (
                <div className='flex items-center space-x-1'>
                  <span>思考中</span>
                  <span className='animate-bounce'>.</span>
                  <span
                    className='animate-bounce'
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                  <span
                    className='animate-bounce'
                    style={{ animationDelay: '400ms' }}
                  >
                    .
                  </span>
                </div>
              ) : (
                msg.content
              )}
            </Text>
            {msg.image_url && (
              <Box style={{ marginTop: '8px' }}>
                <Avatar
                  size='7'
                  src={msg.image_url}
                  radius='medium'
                  fallback='IMG'
                  className='cursor-pointer hover:scale-110 transition-all duration-300'
                />
              </Box>
            )}
          </Box>
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
          {msg.image_url && (
            <Box style={{ marginTop: '8px' }}>
              <Avatar
                size='7'
                src={msg.image_url}
                radius='medium'
                fallback='IMG'
                className='cursor-pointer hover:scale-110 transition-all duration-300'
              />
            </Box>
          )}
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
