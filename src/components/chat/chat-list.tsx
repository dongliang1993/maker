import { Avatar, Box, Flex, ScrollArea, Text } from '@radix-ui/themes'

import { Message, useMessages } from '@/services/message'

type ChatListProps = {
  projectId: string
}

export const ChatList: React.FC<ChatListProps> = ({ projectId }) => {
  const { data: messages = [], isLoading: isLoadingMessages } =
    useMessages(projectId)

  console.log(messages, 'messages')

  return (
    <ScrollArea
      // style={{ height: 'calc(100vh - 260px)' }}
      scrollbars='vertical'
      type='hover'
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
          messages.map((msg: Message) => (
            <Box
              key={msg.id}
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
          ))
        )}
      </Flex>
    </ScrollArea>
  )
}
