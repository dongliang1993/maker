import { R2Storage } from '@/lib/r2-storage'

// 初始化 R2Storage 实例
const r2Storage = new R2Storage({
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
})

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
  async uploadFile(file: File): Promise<UploadResult> {
    const key = generateUniqueFileName(file.name)
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
