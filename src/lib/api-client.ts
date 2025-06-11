interface UploadResult {
  url: string
  key: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api'
  }

  /**
   * 上传图片
   * @param file 要上传的文件
   */
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/images`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '上传失败')
    }

    return response.json()
  }

  /**
   * 获取图片 URL
   * @param key 图片的键
   */
  async getImageUrl(key: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/images?key=${key}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '获取 URL 失败')
    }

    const data = await response.json()
    return data.url
  }

  /**
   * 删除图片
   * @param key 图片的键
   */
  async deleteImage(key: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/images?key=${key}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '删除失败')
    }
  }

  async generations() {
    const response = await fetch(`${this.baseUrl}/generations`, {
      method: 'POST',
    })
  }
}

export const apiClient = new ApiClient()
