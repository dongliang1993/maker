import { tool } from 'ai'
import axios from 'axios'
import { z } from 'zod'

import { OpenAI } from '@/lib/openai'

import type { ImageList, StyleList } from '@/types/project'

export const createImage = ({
  userId,
  imageList,
  styleList,
}: {
  userId: string
  imageList: ImageList
  styleList: StyleList
}) =>
  tool({
    description: 'Create an image from a text prompt',
    parameters: z.object({
      prompt: z.string().describe('The prompt to create an image for'),
    }),
    execute: async ({ prompt }) => {
      try {
        const finalPrompt = buildPrompt({
          userPrompt: prompt,
          imageList: imageList || [],
          style: styleList?.[0],
        })

        const result = await OpenAI.generateImage({
          prompt: finalPrompt,
          userId,
        })

        return {
          imageUrl: result.url,
          prompt,
        }
      } catch (error) {
        console.error('generateImage error', error)
        return { imageUrl: null, prompt }
      }
    },
  })

function buildPrompt({
  userPrompt,
  imageList,
  style,
}: {
  userPrompt: string
  imageList: ImageList
  style?: StyleList[0]
}) {
  let finalPrompt = `
    You are an Image Generation Expert specializing in creating and manipulating images using powerful models. Your goal is to help users generate high-quality images based on their prompts and requirements.

    When handling image generation requests, you should:

    1. **Analyze the Request**:
      - Understand the desired image style and content
      - Note any specific requirements or constraints
      - Evaluate prompt clarity and effectiveness

    2. **Generate the Image**:
      - The user will provide a prompt.
      - If the user provide a example image and style, you must complete the prompt with the style and the image.
  `

  if (imageList.length > 0) {
    finalPrompt += `
      Here is the image you need to transform: ${imageList[0]?.imageUrl}
    `
  }

  if (style) {
    finalPrompt += `
      Here is the style user provided:
      Style Cover Url: ${style.styleCoverUrl}
      Style Prompt: ${style.imagePrompt}
    `
  }

  finalPrompt += `
    Here is the prompt you need to use to transform the image:
  ${userPrompt}
`

  return finalPrompt
}

async function generateImage(prompt: string) {
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
