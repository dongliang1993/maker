import { r2Storage } from '@/lib/r2-storage'
import axios from 'axios'

import type { UploadResult } from '@/types/global'

export class OpenAI {
  static async generateImage({
    prompt,
    userId,
  }: {
    prompt: string
    userId: string
  }) {
    const response = await axios(`${process.env.BASE_API}/images/generations`, {
      method: 'POST',
      data: {
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        output_format: 'png',
      },
      headers: {
        Authorization: `sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
      },
      timeout: 10000000,
    })

    const data = response.data.data
    const image_base64 = data[0].b64_json
    const key = `${userId}/${Date.now()}-generated.png`
    const contentType = 'image/png'

    const image = await r2Storage.uploadFileByBase64(
      key,
      image_base64,
      contentType
    )

    return {
      url: image,
      pathName: key,
      contentType,
      prompt,
    } as UploadResult
  }
}
