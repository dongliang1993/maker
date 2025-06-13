import { useMessages, useSendMessage } from '@/services/message'
import {
  ArrowUpIcon,
  Component1Icon,
  GlobeIcon,
  Link2Icon,
  PlusIcon,
} from '@radix-ui/react-icons'
import {
  Box,
  Flex,
  IconButton,
  ScrollArea,
  Text,
  TextArea,
} from '@radix-ui/themes'
import React, { useState } from 'react'

import type { Message } from '@/services/message'

interface ChatBoxProps {
  projectId: string
}

export const ChatBox: React.FC<ChatBoxProps> = ({ projectId }) => {
  const [input, setInput] = useState('')

  // 使用 React Query hooks
  const { data: messages = [], isLoading: isLoadingMessages } =
    useMessages(projectId)
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()

  // 处理发送消息
  const handleSendMessage = () => {
    if (!input.trim() || isSending) return

    sendMessage(
      {
        projectId,
        content: input.trim(),
      },
      {
        onSuccess: () => {
          setInput('')
        },
      }
    )
  }

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box
      style={{
        padding: '12px 16px',
        boxShadow: 'rgba(193, 193, 193, 0.25) 0px 4px 81.6px 0px',
        border: '1px solid #e9e9e9',
      }}
      className='fixed bottom-10 rounded-xl bg-white w-2/3 left-1/2 -translate-x-1/2'
    >
      <Flex direction='column' gap='3'>
        {/* 消息列表 */}
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
                    <img
                      src={msg.image_url}
                      alt='Message attachment'
                      style={{
                        maxWidth: '200px',
                        marginTop: '8px',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                </Box>
              ))
            )}
          </Flex>
        </ScrollArea>

        {/* 输入区域 */}
        <TextArea
          placeholder='Please enter your design requirements...'
          size='2'
          variant='surface'
          resize='none'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Flex justify='between' align='center'>
          <Flex gap='2'>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <PlusIcon width='18' height='18' />
            </IconButton>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <Link2Icon width='18' height='18' />
            </IconButton>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <GlobeIcon width='18' height='18' />
            </IconButton>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <Component1Icon width='18' height='18' />
            </IconButton>
          </Flex>
          <IconButton
            size='2'
            radius='large'
            variant='soft'
            onClick={handleSendMessage}
            disabled={isSending || !input.trim()}
          >
            <ArrowUpIcon width='20' height='20' />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  )
}
