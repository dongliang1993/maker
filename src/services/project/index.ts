import type { Project } from '@/database/repositories/projects.repository'

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`获取项目失败: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error('获取项目失败:', error)
    return null
  }
}
