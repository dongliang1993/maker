import { tool } from 'ai'
import { z } from 'zod'

export const generateImages = () =>
  tool({
    description: `
    You are a helpful assistant that can generate images.
    You can use this tool to generate images.
    `,
    parameters: z.object({
      prompt: z.string().optional(),
      imageList: z.array(z.string()).optional(),
      styleList: z.array(z.string()).optional(),
    }),
    execute: async ({ prompt, imageList, styleList }) => {
      console.log('Tool called with:', {
        prompt,
        imageList,
        styleList,
      })

      return {
        images: [],
      }
    },
  })
