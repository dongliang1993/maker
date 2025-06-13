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

      console.log('🔍 项目:', data)

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

  async create(project: Partial<Project>): Promise<Project> {
    return this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .insert(project)
        .select()
        .single()
      return this.checkResult({ data, error })
    })
  }
}
