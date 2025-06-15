import { createFal } from '@ai-sdk/fal'

const BASE_API = 'https://api.tu-zi.com/flux/v1'

const fal = createFal({
  apiKey: 'sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj',
  baseURL: BASE_API,
  headers: {
    Authorization: `sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
  },
})

type ImageList = {
  imageUrl: string
}[]

type StyleList = {
  styleName: string
  styleCoverUrl: string
  imagePrompt: string
}[]

export class Fal {
  static transformMessagesToPrompt({
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

  static async generateImage({
    prompt: userPrompt,
    imageList,
    styleList,
  }: {
    prompt: string
    imageList: ImageList
    styleList: StyleList
  }) {
    const prompt = this.transformMessagesToPrompt({
      userPrompt,
      imageList,
      styleList,
    })
    console.log(`[Fal] prompt: ${prompt}`)

    // const { image, images } = await generateImage({
    //   model: fal.image('fal-ai/flux-pro/kontext'),
    //   prompt,
    // })

    // return {
    //   image,
    //   images,
    // }
  }
}
