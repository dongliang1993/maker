import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 项目相关的类型定义
export interface Project {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  user_id: string
}

// 项目相关的数据操作
export const projectService = {
  // 获取用户的所有项目
  async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  },

  // 创建新项目
  async createProject(
    project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  // 更新项目
  async updateProject(id: number, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  // 删除项目
  async deleteProject(id: number) {
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error
  },
}
