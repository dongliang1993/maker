import { useMutation } from '@tanstack/react-query'

import { r2Storage } from '@/lib/r2-storage'

/**
 * 生成唯一的文件名
 * @param originalName 原始文件名
 * @returns 唯一的文件名
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${randomString}.${extension}`
}

export interface UploadResult {
  url: string
  key: string
}

export const r2StorageService = {
  /**
   * 上传文件
   * @param file 要上传的文件
   * @returns 上传结果，包含文件URL和存储键
   */
  async uploadFile({
    key,
    file,
  }: {
    key: string
    file: File
  }): Promise<UploadResult> {
    key = key || generateUniqueFileName(file.name)
    const url = await r2Storage.uploadFile(key, file)
    return { url, key }
  },

  /**
   * 下载文件
   * @param key 文件的存储键
   * @returns 文件的 Blob 对象
   */
  async downloadFile(key: string): Promise<Blob> {
    return await r2Storage.downloadFile(key)
  },

  /**
   * 删除文件
   * @param key 文件的存储键
   */
  async deleteFile(key: string): Promise<void> {
    await r2Storage.deleteFile(key)
  },

  /**
   * 获取文件的公共访问URL
   * @param key 文件的存储键
   * @returns 文件的公共访问URL
   */
  getPublicUrl(key: string): string {
    return r2Storage.getPublicUrl(key)
  },
}

// React Query Hook
export const useUploadImage = () => {
  return useMutation({
    mutationFn: r2StorageService.uploadFile,
  })
}
