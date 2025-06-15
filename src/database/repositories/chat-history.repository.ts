import { DatabaseClient } from '../client'
import { DatabaseResult } from '../types'

export interface Message {
  id: string
  user_id: string
  project_id: string
  content: string
  image_url?: string
  role: 'user' | 'assistant'
  created_at: Date
}

export class ChatHistoryRepository extends DatabaseClient {
  private readonly table = 'messages'

  async findByProject(projectId: string): Promise<DatabaseResult<Message[]>> {
    return await this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      return { data, error }
    })
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

  async upsertMany(
    messages: Array<Omit<Message, 'id' | 'created_at'>>
  ): Promise<DatabaseResult<Message[]>> {
    return await this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .upsert(messages)
        .select()

      if (error) {
        console.error('批量创建消息失败:', error)
      }

      return { data, error }
    })
  }
}
