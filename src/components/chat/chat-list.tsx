import { Avatar, Box, Flex, ScrollArea, Text } from '@radix-ui/themes'

import { Message, useMessages } from '@/services/message'

type ChatListProps = {
  projectId: string
}

export const ChatList: React.FC<ChatListProps> = ({ projectId }) => {
  const { data: messages = [], isLoading: isLoadingMessages } =
    useMessages(projectId)

  return (
    <div>
      <ScrollArea
        style={{ maxHeight: '300px' }}
        scrollbars='vertical'
        type='hover'
      >
        <Flex direction='column' gap='2'>
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
                style={{
                  padding: '8px 12px',
                  backgroundColor: msg.role === 'user' ? '#f5f5f5' : 'white',
                  borderRadius: '8px',
                }}
              >
                <Text size='2'>{msg.content}</Text>
                {msg.image_url && (
                  <Box style={{ marginTop: '8px' }}>
                    <Avatar
                      size='7'
                      src={msg.image_url}
                      radius='medium'
                      fallback='IMG'
                    />
                  </Box>
                )}
              </Box>
            ))
          )}
        </Flex>
      </ScrollArea>
    </div>
  )
}
