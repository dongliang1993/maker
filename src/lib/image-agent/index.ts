import axios from 'axios'

const BASE_API = 'https://api.tu-zi.com'

export type GenerationsConfig = {
  model?: 'flux-kontext-pro'
  prompt: string
  aspect_ratio?: string
  output_format?: 'png'
  safety_tolerance?: 2
  prompt_upsampling?: boolean
}

class ImageAgent {
  constructor() {}

  public async run() {}

  // 生成图片
  async generations(config: GenerationsConfig) {
    const response = axios({
      method: 'POST',
      url: `${BASE_API}/v1/images/generations`,
      data: {
        prompt: config.prompt,
        aspect_ratio: '16:9',
        model: 'flux-kontext-pro',
        output_format: 'png',
        prompt_upsampling: false,
      },
      headers: {
        Authorization: `sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
      },
    }).then((res) => res.data)

    return response
  }
}

const imageAgent = new ImageAgent()

export { imageAgent }
