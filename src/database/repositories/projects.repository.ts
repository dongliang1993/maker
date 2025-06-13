import { DatabaseClient } from '../client'
import { DatabaseResult } from '../types'

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

  async findAll({
    userId,
  }: {
    userId: string
  }): Promise<DatabaseResult<Project[]>> {
    return this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return {
        data,
        error,
      }
    })
  }

  async findUnique({
    userId,
    projectId,
  }: {
    userId: string
    projectId: string
  }): Promise<DatabaseResult<Project | null>> {
    try {
      return this.query(async (supabase) => {
        const { data, error } = await supabase
          .from(this.table)
          .select('*')
          .eq('user_id', userId)
          .eq('id', projectId)
          .single()

        return {
          data,
          error,
        }
      })
    } catch (error) {
      console.error('🚨 User findUnique error:', error)
      return {
        data: null,
        error: true,
        message: 'User findUnique error',
      }
    }
  }

  async findById(id: string): Promise<Project | null> {
    const result = await this.query(
      async (supabase) =>
        await supabase.from(this.table).select('*').eq('id', id).single()
    )

    if (!result?.data) {
      return null
    }

    return result.data as Project
  }

  async create(
    project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Project | null> {
    const result = await this.query(
      async (supabase) =>
        await supabase.from(this.table).insert(project).select().single()
    )

    if (!result?.data) {
      return null
    }

    return result.data as Project
  }

  async findByUser(userId: string): Promise<Project[]> {
    const result = await this.query(
      async (supabase) =>
        await supabase
          .from(this.table)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
    )

    if (!result?.data) {
      return []
    }

    return result.data as Project[]
  }

  async update(
    id: string,
    project: Partial<Project>
  ): Promise<DatabaseResult<Project | null>> {
    return this.query(async (supabase) => {
      const { data, error } = await supabase
        .from(this.table)
        .update(project)
        .eq('id', id)
        .select()
        .single()

      return {
        data,
        error,
      }
    })
  }
}
