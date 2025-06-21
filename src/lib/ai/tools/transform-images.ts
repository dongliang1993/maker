// 将图片转换为指定风格
import { tool } from 'ai'
import { z } from 'zod'

import { OpenAI } from '@/lib/openai'

import type { ImageList } from '@/database/types'
import type { StyleList } from '@/types/project'

export const transformImage = ({
  userId,
  imageList,
  styleList,
}: {
  userId: string
  imageList: ImageList
  styleList: StyleList
}) =>
  tool({
    description: 'Transform an image to a specified style',
    parameters: z.object({
      prompt: z.string().describe('The prompt to transform the image'),
    }),
    execute: async ({ prompt }) => {
      const finalPrompt = buildPrompt({
        prompt,
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
    },
  })

function buildPrompt({
  prompt,
  imageList,
  style,
}: {
  prompt: string
  imageList: ImageList
  style: StyleList[0]
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
      - you must generate a new image that is a transformation of the original image to the specified style.

    Here is the image you need to transform: ${imageList[0]?.imageUrl}
  `

  if (style) {
    finalPrompt += `
      Here is the style user provided:
      Style Cover Url: ${style.styleCoverUrl}
      Style Prompt: ${style.imagePrompt}
    `
  }

  finalPrompt += `
    Here is the prompt you need to use to transform the image:
    ${prompt}
  `

  return finalPrompt
}
