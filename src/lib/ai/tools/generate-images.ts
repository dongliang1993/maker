import { tool } from 'ai'
import axios from 'axios'
import { z } from 'zod'

import type { ImageList, StyleList } from '@/types/project'

export const createImage = tool({
  description: 'Create an image from a previous text prompt',
  parameters: z.object({
    prompt: z.string().describe('The prompt to create an image for'),
    imageList: z.array(
      z.object({
        imageUrl: z.string().describe('The url of the image to use'),
      })
    ),
    styleList: z.array(
      z.object({
        styleName: z.string().describe('The name of the style'),
        styleCoverUrl: z.string().describe('The url of the style cover image'),
        imagePrompt: z.string().describe('The prompt of the style'),
      })
    ),
  }),
  execute: async ({ prompt }) => {
    try {
      return {
        imageUrl:
          'https://assets-persist.lovart.ai/agent_images/fa4ed330-0ad9-436e-a590-c0e9620f9340.png',
      }
      // const imageUrl = await generateImage(prompt)
    } catch (error) {
      console.error('generateImage error', error)
      return { imageUrl: null }
    }
  },
})

function buildPrompt({
  userPrompt,
  imageList,
  styleList,
}: {
  userPrompt: string
  imageList: ImageList
  styleList: StyleList
}) {
  let finalPrompt = `Here is the user prompt: ${userPrompt}`

  if (imageList.length > 0) {
    finalPrompt += `\nAnd There is a user uploaded image: ${imageList[0]?.imageUrl}`
  }

  if (styleList.length > 0) {
    finalPrompt += `\nUser also uploaded a reference image: ${styleList[0]?.styleCoverUrl}. You can use the style of the reference image to generate the image. \nThe style is: ${styleList[0]?.imagePrompt}`
  }

  return finalPrompt
}

async function generateImage(prompt: string) {
  console.log('generateImage', prompt)

  const response = await axios(
    'https://api.tu-zi.com/flux/v1/flux-kontext-pro',
    {
      method: 'POST',
      data: {
        prompt: prompt,
        prompt_upsampling: false,
        output_format: 'jpeg',
        safety_tolerance: 6,
      },
      headers: {
        Authorization: `sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
      },
    }
  )
  const data = response.data

  console.log('----response----', data)
  // 需要轮询 polling_url 获取结果
  const pollingUrl = data.polling_url
  const polling = async () => {
    const pollingResponse = await fetch(pollingUrl).then((res) => res.json())
    if (pollingResponse.status === 'Ready') {
      return pollingResponse.result.sample
    }

    return polling()
  }

  // 轮询获取结果
  const imageUrl = await polling()

  return imageUrl
}
