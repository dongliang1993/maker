import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from './api-client'

// 上传图片的 mutation hook
export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => apiClient.uploadImage(file),
  })
}

// 获取图片 URL 的 query hook
export const useImageUrl = (key: string | null) => {
  return useQuery({
    queryKey: ['image', key],
    queryFn: () => (key ? apiClient.getImageUrl(key) : null),
    enabled: !!key,
  })
}

// 删除图片的 mutation hook
export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (key: string) => apiClient.deleteImage(key),
  })
}

// 转换图片的 mutation hook
export const useGenerationsImage = () => {
  return useMutation({
    mutationFn: () => apiClient.generations(),
  })
}
