'use client'

import { ArrowUpIcon, Cross2Icon } from '@radix-ui/react-icons'
import {
  Avatar,
  Badge,
  Box,
  Flex,
  IconButton,
  TextArea,
} from '@radix-ui/themes'
import React, { useState } from 'react'

import StylePick from './style-pick'
import UploadIcon from './upload-icon'

import { useChat } from '@/lib/use-chat'
import { useUploadImage } from '@/services/file'

import type { Style } from '@/constants/preset-styles'

interface ChatBoxProps {
  projectId: string
}

export const ChatBox: React.FC<ChatBoxProps> = ({ projectId }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [style, setStyle] = useState<Style | null>(null)
  const { input, handleInputChange, handleSubmit, isLoading } = useChat()

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
  }

  const { mutate: uploadImage, isPending: isUploading } = useUploadImage()

  // 处理发送消息
  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return
    handleSubmit(
      {},
      {
        data: JSON.stringify({
          projectId,
          imageList: imageUrl ? [{ imageUrl }] : [],
          text: input.trim(),
          styleList: style
            ? [
                {
                  styleCoverUrl: style.url,
                  imagePrompt: style.prompt,
                  styleName: style.name,
                },
              ]
            : [],
        }),
        allowEmptySubmit: false,
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

  // 选择风格
  const handleStylePick = (style: Style | null) => {
    setStyle(style)
  }

  const renderStyle = () => {
    if (style) {
      return (
        <div className='relative cursor-pointer'>
          <Avatar size='5' src={style.url} radius='medium' fallback='IMG' />
          <Badge
            variant='solid'
            className='absolute bottom-0 right-0'
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
            }}
          >
            {style.name}
          </Badge>
          <IconButton
            size='1'
            variant='ghost'
            color='gray'
            style={{
              padding: 0,
              position: 'absolute',
              top: '6px',
              right: '6px',
            }}
            onClick={() => setStyle(null)}
          >
            <Cross2Icon
              width='18'
              height='18'
              className='hover:bg-gray-300 rounded-md cursor-pointer'
            />
          </IconButton>
        </div>
      )
    }
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
            {renderStyle()}
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
          onChange={handleInput}
          onKeyDown={handleKeyPress}
        />
        <Flex justify='between' align='center'>
          <Flex gap='2'>
            <UploadIcon
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
            />
            <StylePick onStylePick={handleStylePick} />
          </Flex>
          <IconButton
            size='2'
            radius='large'
            variant='soft'
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <ArrowUpIcon width='20' height='20' />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  )
}
