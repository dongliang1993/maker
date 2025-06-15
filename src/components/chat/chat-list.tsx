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
import { UIMessage, useChatStore } from '@/lib/use-chat'

type ChatListProps = {
  projectId?: string
  loading: boolean
}

export const ChatList: React.FC<ChatListProps> = ({ loading }) => {
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)

  console.log(messages, 'messages')

  const messagesLength = messages.length

  const renderUIMessage = (msg: UIMessage) => {
    if (msg.role !== 'user') {
      const hasContent = (msg.content?.length ?? 0) > 0

      return (
        <Container key={msg.id}>
          <Logo size={2} className='mb-2' />
          <Box
            className='rounded-md py-3 px-4'
            style={{
              background: hasContent
                ? 'rgb(241, 245, 235)'
                : 'linear-gradient(90deg,#f5f5f5 0%,#fbfbfb 100%)',
            }}
          >
            {msg.text && (
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
                  msg.text
                )}
              </Text>
            )}

            {msg.name && (
              <span
                className='inline-flex mb-3 px-4 rounded-2xl font-bold text-sm box-border bg-white leading-7'
                style={{
                  color: 'rgb(136, 168, 87)',
                }}
              >
                {msg.name}
              </span>
            )}

            {hasContent &&
              msg.content?.map((content, index) => {
                return (
                  <Box key={index}>
                    <Box key={index}>
                      {content.eventData.artifact.map((artifact) => (
                        <Avatar
                          key={artifact.imageUrl}
                          size='7'
                          src={artifact.imageUrl}
                          radius='medium'
                          fallback='IMG'
                          className='cursor-pointer hover:scale-110 transition-all duration-300'
                        />
                      ))}
                    </Box>
                  </Box>
                )
              })}
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
            {msg.text}
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
