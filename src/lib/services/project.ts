import { Project } from '@/types/project'

class ProjectService {
  // 获取项目列表
  async getProjects(): Promise<Project[]> {
    const response = await fetch('/api/projects')
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '获取项目列表失败')
    }
    return response.json()
  }

  // 创建项目
  async createProject(data: {
    name: string
    description: string
  }): Promise<Project> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '创建项目失败')
    }

    return response.json()
  }

  // 更新项目
  async updateProject(
    id: string,
    data: { name?: string; description?: string }
  ): Promise<Project> {
    const response = await fetch('/api/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '更新项目失败')
    }

    return response.json()
  }

  // 删除项目
  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`/api/projects?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '删除项目失败')
    }
  }
}

export const projectService = new ProjectService()
