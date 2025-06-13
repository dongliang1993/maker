import { DatabaseClient } from '../client'

export interface Project {
  id: string
  name: string
  description: string
  user_id: string
  created_at: Date
  updated_at: Date
}

export class ProjectsRepository extends DatabaseClient {
  private readonly table = 'projects'

  async findAll({ userId }: { userId: string }): Promise<Project[]> {
    return this.query(async (supabase) => {
      return await supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    })
  }

  async findUnique({
    userId,
    projectId,
  }: {
    userId: string
    projectId: string
  }): Promise<Project | null> {
    try {
      const data: Project | null = await this.query(
        async (supabase) =>
          await supabase
            .from(this.table)
            .select('*')
            .eq('user_id', userId)
            .eq('id', projectId)
            .single()
      )

      if (!data) {
        console.log('🔍 用户不存在')
        return null
      }

      return data
    } catch (error) {
      console.error('🚨 User findUnique error:', error)
      return null
    }
  }

  async create(
    project: Partial<Project>
  ): Promise<{ data: Project | null; error: unknown }> {
    return this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .insert(project)
        .select()
        .single()

      return {
        data,
        error,
      }
    })
  }
}
