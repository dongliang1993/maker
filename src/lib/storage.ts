import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

interface StorageConfig {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  publicUrl: string
}

class Storage {
  private client: S3Client
  private bucketName: string
  private publicUrl: string

  constructor(config: StorageConfig) {
    this.bucketName = config.bucketName
    this.publicUrl = config.publicUrl
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }

  async upload({
    key,
    body,
    contentType,
  }: {
    key: string
    body: Buffer
    contentType: string
  }) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    )

    return {
      key,
      url: `${this.publicUrl}/${key}`,
    }
  }

  async get(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    const result = await this.client.send(command)
    return result
  }

  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.client.send(command)
  }
}

let storage: Storage | null = null

export function getStorage() {
  if (!storage) {
    storage = new Storage({
      accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL!,
    })
  }

  return storage
}
