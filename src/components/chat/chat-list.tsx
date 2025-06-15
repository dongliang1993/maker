import {
  Avatar,
  Box,
  Container,
  Flex,
  ScrollArea,
  Text,
} from '@radix-ui/themes'
import { useEffect } from 'react'

import { Logo } from '@/components/logo'
import { Message, useMessages } from '@/services/message'

type ChatListProps = {
  projectId: string
}

export const ChatList: React.FC<ChatListProps> = ({ projectId }) => {
  const { data: messages = [], isLoading: isLoadingMessages } =
    useMessages(projectId)

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
      style={{
        // @ts-expect-error 忽略类型错误
        '--radix-scroll-area-thumb-width': '0px',
        '--radix-scrollbar-hover-width': '0px',
        '--radix-scrollbar-hover-color': 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Flex direction='column' gap='5'>
        {isLoadingMessages ? (
          <Text size='2' color='gray'>
            加载消息中...
          </Text>
        ) : messages.length === 0 ? (
          <Text size='2' color='gray'>
            暂无消息
          </Text>
        ) : (
          messages.map(renderMessage)
        )}
      </Flex>
    </ScrollArea>
  )
}
