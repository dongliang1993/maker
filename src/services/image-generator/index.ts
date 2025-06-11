import axios from 'axios'

const BASE_API = 'https://api.tu-zi.com'

const GBIBLI_STYLE_PROMPT = `Transform this image into Studio Ghibli animation style, maintaining the original composition but adding Ghibli's characteristic soft, hand-drawn aesthetic, watercolor-like backgrounds, and whimsical atmosphere. Use Hayao Miyazaki's distinctive art style with attention to natural elements and environmental details. Keep the same scene and action but render it as if it were a frame from a Ghibli film.`

export type GenerationsConfig = {
  prompt: string
  image_url: string
  model?: 'flux-kontext-pro'
  aspect_ratio?: string
  output_format?: 'png'
  safety_tolerance?: 2
  prompt_upsampling?: boolean
}

class ImageGenerator {
  async processPrompt(prompt: string, image_url: string) {
    return `${image_url} ${GBIBLI_STYLE_PROMPT}`
  }
  /**
   * 生成图片
   * @param config
   * @returns
   */
  async generations(config: GenerationsConfig) {
    const prompt = await this.processPrompt(config.prompt, config.image_url)

    const response = await axios({
      method: 'POST',
      url: `${BASE_API}/v1/images/generations`,
      data: {
        prompt,
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

const imageGenerator = new ImageGenerator()

export { imageGenerator }
