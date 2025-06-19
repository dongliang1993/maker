import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { request } from '../request'

import type { Project } from '@/database/types'

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const project = await request<Project>({
      url: `/api/projects/${projectId}`,
      method: 'GET',
    })

    return project
  } catch (error) {
    console.error('获取项目失败:', error)
    return null
  }
}

export async function getProjectList(): Promise<Project[]> {
  try {
    const projects = await request<Project[]>({
      url: '/api/projects',
      method: 'GET',
    })

    return projects
  } catch (error) {
    console.error('获取项目列表失败:', error)
    return []
  }
}

export async function updateProject(
  projectId: string,
  data: Partial<Project>
): Promise<Project> {
  try {
    const project = await request<Project>({
      url: `/api/projects/${projectId}`,
      method: 'POST',
      data,
    })

    return project
  } catch (error) {
    console.error('更新项目失败:', error)
    return data as Project
  }
}

type ProjectQueryKey = ['project', string]

interface UseProjectOptions {
  queryOptions?: Omit<
    UseQueryOptions<Project | null, Error, Project | null, ProjectQueryKey>,
    'queryKey' | 'queryFn'
  >
  mutationOptions?: Omit<
    UseMutationOptions<Project, Error, Partial<Project>>,
    'mutationFn'
  >
}

export const useProject = (
  projectId: string,
  options: UseProjectOptions = {}
) => {
  const { queryOptions, mutationOptions } = options

  const query = useQuery({
    queryKey: ['project', projectId] as const,
    queryFn: () => getProject(projectId),
    ...queryOptions,
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<Project>) => updateProject(projectId, data),
    ...mutationOptions,
  })

  return {
    // 查询相关
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,

    // 更新相关
    update: mutation.mutate,
    updateAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
    reset: mutation.reset,
  }
}

export const useProjectList = () => {
  return useQuery({
    queryKey: ['project-list'],
    queryFn: () => getProjectList(),
  })
}
