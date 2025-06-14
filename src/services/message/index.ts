import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Message {
  id: string
  user_id: string
  project_id: string
  content: string
  image_url?: string
  role: 'user' | 'assistant'
  created_at: string
}

interface SendMessageParams {
  projectId: string
  content: string
  imageUrl?: string
}

// API 调用函数
const sendMessage = async (params: SendMessageParams) => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('发送消息失败')
  }

  return response.json()
}

const getMessages = async (projectId: string) => {
  const response = await fetch(`/api/messages?projectId=${projectId}`)

  if (!response.ok) {
    throw new Error('获取消息失败')
  }

  // 检查响应的 Content-Type
  const contentType = response.headers.get('Content-Type')

  if (contentType?.includes('text/event-stream')) {
    if (!response.body) {
      throw new Error('没有响应数据')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    let result = ''

    while (true) {
      const { done, value } = await reader?.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      result += chunk
      console.log(chunk)
    }

    return result
  }

  return response.json()
}

// React Query Hooks
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMessage,
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
      const optimisticUserMessage: Message = {
        id: `temp-${Date.now()}`,
        project_id: projectId,
        content,
        image_url: imageUrl,
        role: 'user',
        user_id: '', // 服务器会设置正确的 user_id
        created_at: new Date().toISOString(),
      }

      const optimisticAssistantMessage: Message = {
        id: `temp-loading-${Date.now()}`,
        project_id: projectId,
        content: '正在思考中...',
        role: 'assistant',
        user_id: '',
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Message[]>(
        ['messages', projectId],
        (old = []) => [
          ...old,
          optimisticUserMessage,
          optimisticAssistantMessage,
        ]
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

export const useMessages = (projectId: string) => {
  return useQuery({
    queryKey: ['messages', projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 30 * 1000, // 数据在 30 秒内被认为是新鲜的
    refetchInterval: 30 * 1000, // 每 30 秒自动重新获取
  })
}

// 常量
export const MESSAGE_QUERY_KEY = {
  all: ['messages'] as const,
  byProject: (projectId: string) => ['messages', projectId] as const,
}
