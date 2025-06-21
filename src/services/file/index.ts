import { useMutation } from '@tanstack/react-query'

import { UploadResult } from '@/types/global'

// API 调用函数
const uploadImage = async (file: File): Promise<UploadResult> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/file', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  return response.json()
}

// React Query Hook
export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  })
}
