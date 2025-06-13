import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Message } from '@/database/types'

export type { Message }

class MessageService {
  static async fetchMessages(projectId: string): Promise<Message[]> {
    const response = await fetch(`/api/messages?projectId=${projectId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    return response.json()
  }

  static async sendMessage({
    projectId,
    content,
    imageUrl,
  }: {
    projectId: string
    content: string
    imageUrl?: string
  }): Promise<Message> {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        content,
        imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.json()
  }
}

// React Query Hooks
export const useMessages = (projectId: string) => {
  return useQuery({
    queryKey: ['messages', projectId],
    queryFn: () => MessageService.fetchMessages(projectId),
    staleTime: 30 * 1000, // 数据在 30 秒内被认为是新鲜的
    refetchInterval: 30 * 1000, // 每 30 秒自动重新获取
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: MessageService.sendMessage,
    // 乐观更新：立即更新 UI，不等待服务器响应
    onMutate: async ({ projectId, content, imageUrl }) => {
      // 取消任何正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: ['messages', projectId] })

      // 获取之前的消息
      const previousMessages = queryClient.getQueryData<Message[]>([
        'messages',
        projectId,
      ])

      // 乐观地更新缓存
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        project_id: projectId,
        content,
        image_url: imageUrl,
        role: 'user',
        user_id: '', // 服务器会设置正确的 user_id
        created_at: new Date(),
      }

      queryClient.setQueryData<Message[]>(
        ['messages', projectId],
        (old = []) => [...old, optimisticMessage]
      )

      return { previousMessages }
    },
    // 如果发送失败，回滚到之前的状态
    onError: (err, { projectId }, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['messages', projectId],
          context.previousMessages
        )
      }
      console.error('发送消息失败:', err)
    },
    // 发送成功后，重新获取消息列表以确保数据同步
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', projectId] })
    },
  })
}

// 常量
export const MESSAGE_QUERY_KEY = {
  all: ['messages'] as const,
  byProject: (projectId: string) => ['messages', projectId] as const,
}
