import { DatabaseClient } from '../client'
import { DatabaseResult, ImageList } from '../types'

export type ToolContent = {
  eventType: string
  eventData: {
    eventType: string
    artifact: Artifact[]
  }
}

export interface DBMessage {
  id: string
  // 模型名称
  name?: string
  user_id: string
  project_id: string
  content?: string
  parts?: any[]
  tool_content?: ToolContent[]
  image_list?: ImageList
  role: 'user' | 'assistant' | 'system' | 'tool' | 'data'
  created_at: string
}

export type Artifact = {
  imageUrl: string
  source: string
}

export class ChatHistoryRepository extends DatabaseClient {
  private readonly table = 'messages'

  async findByProject(projectId: string): Promise<DatabaseResult<DBMessage[]>> {
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
    message: Omit<DBMessage, 'id' | 'created_at'>
  ): Promise<DBMessage | null> {
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

    return result.data as DBMessage
  }

  async upsertMany(
    messages: Array<Omit<DBMessage, 'id' | 'created_at'>>
  ): Promise<DatabaseResult<DBMessage[]>> {
    return await this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .insert(messages)
        .select()

      if (error) {
        console.error('批量创建消息失败:', error)
      }

      return { data, error }
    })
  }
}
