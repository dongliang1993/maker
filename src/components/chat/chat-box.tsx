import {
  ArrowUpIcon,
  Component1Icon,
  GlobeIcon,
  Link2Icon,
} from '@radix-ui/react-icons'
import { Avatar, Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import React, { useState } from 'react'

import UploadIcon from './upload-icon'

import { useUploadImage } from '@/services/file'
import { useSendMessage } from '@/services/message'

interface ChatBoxProps {
  projectId: string
}

export const ChatBox: React.FC<ChatBoxProps> = ({ projectId }) => {
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  const { mutate: uploadImage, isPending: isUploading } = useUploadImage()
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()

  // 处理发送消息
  const handleSendMessage = () => {
    if (!input.trim() || isSending) return

    setInput('')

    sendMessage(
      {
        projectId,
        content: input.trim(),
        imageUrl,
      },
      {
        onSuccess: () => {
          setImageUrl(undefined)
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

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    return new Promise((resolve, reject) => {
      uploadImage(file, {
        onSuccess: (result) => {
          setImageUrl(result.url)
        },
        onError: (error) => {
          console.error('上传图片失败:', error)
          reject(error)
        },
        onSettled: () => {
          resolve(true)
        },
      })
    })
  }

  return (
    <Box
      style={{
        padding: '12px 16px',
        boxShadow: 'rgba(193, 193, 193, 0.25) 0px 4px 81.6px 0px',
        border: '1px solid #e9e9e9',
      }}
      className='fixed bottom-10 rounded-xl bg-white w-1/2 left-1/3 -translate-x-1/2'
    >
      <Flex direction='column' gap='3'>
        {/* 图片列表 */}
        <Flex direction='column' gap='3'>
          <Flex direction='row' gap='3'>
            {imageUrl && (
              <Avatar size='5' src={imageUrl} radius='medium' fallback='IMG' />
            )}
          </Flex>
        </Flex>
        {/* 输入区域 */}
        <TextArea
          placeholder='Please enter your design requirements...'
          size='2'
          variant='surface'
          resize='none'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Flex justify='between' align='center'>
          <Flex gap='2'>
            <UploadIcon
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
            />
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
