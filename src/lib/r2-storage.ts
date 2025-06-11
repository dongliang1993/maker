import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
}

export class R2Storage {
  private client: S3Client
  private bucketName: string
  private accountId: string

  constructor(config: R2Config) {
    this.bucketName = config.bucketName
    this.accountId = config.accountId
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }

  /**
   * 上传文件到 R2 存储
   * @param key 文件在存储中的唯一标识符
   * @param file 要上传的文件（File 或 Blob 对象）
   * @param contentType 文件的 MIME 类型
   */
  async uploadFile(
    key: string,
    file: File | Blob,
    contentType?: string
  ): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: contentType || file.type,
      ACL: 'public-read',
    })

    await this.client.send(command)
    return this.getPublicUrl(key)
  }

  /**
   * 从 R2 存储下载文件
   * @param key 文件的唯一标识符
   */
  async downloadFile(key: string): Promise<Blob> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    const response = await this.client.send(command)
    if (!response.Body) {
      throw new Error('文件不存在')
    }

    // 使用 arrayBuffer 处理响应数据
    const arrayBuffer = await response.Body.transformToByteArray()
    return new Blob([arrayBuffer], {
      type: response.ContentType,
    })
  }

  /**
   * 删除 R2 存储中的文件
   * @param key 文件的唯一标识符
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.client.send(command)
  }

  /**
   * 生成文件的公共访问 URL
   * @param key 文件的唯一标识符
   */
  getPublicUrl(key: string): string {
    // 使用公共访问端点
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
  }
}
