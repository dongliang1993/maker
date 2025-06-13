import { DatabaseClient } from '../client'

export interface Message {
  id: string
  user_id: string
  project_id: string
  content: string
  image_url?: string
  role: 'user' | 'assistant'
  created_at: Date
}

export class MessagesRepository extends DatabaseClient {
  private readonly table = 'messages'

  async findByProject(projectId: string): Promise<Message[]> {
    const result = await this.query(
      async (supabase) =>
        await supabase
          .from(this.table)
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true })
    )

    if (!result?.data) {
      return []
    }

    return result.data as Message[]
  }

  async create(
    message: Omit<Message, 'id' | 'created_at'>
  ): Promise<Message | null> {
    const result = await this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .insert(message)
        .select()
        .single()

      if (error) {
        console.error('创建消息失败:', error)
        throw error
      }

      return { data, error }
    })

    if (!result?.data) {
      console.error('创建消息返回空数据')
      return null
    }

    return result.data as Message
  }
}
