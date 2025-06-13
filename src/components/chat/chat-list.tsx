import {
  Avatar,
  Box,
  Container,
  Flex,
  ScrollArea,
  Text,
} from '@radix-ui/themes'

import { Message, useMessages } from '@/services/message'

import { Logo } from '@/components/logo'

type ChatListProps = {
  projectId: string
}

export const ChatList: React.FC<ChatListProps> = ({ projectId }) => {
  const { data: messages = [], isLoading: isLoadingMessages } =
    useMessages(projectId)

  const renderMessage = (msg: Message) => {
    if (msg.role === 'assistant') {
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
              className='cursor-text'
              style={{
                color: '#2f3640',
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

  console.log(messages, 'messages')

  return (
    <ScrollArea scrollbars='vertical' type='hover'>
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
