import { NextResponse } from 'next/server'
import { imageGenerator } from '@/services/image-generator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, image_url } = body

    if (!prompt || !image_url) {
      return NextResponse.json(
        {
          success: false,
          message: 'Prompt and image_url are required',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Generation completed successfully',
        data: {
          data: [
            {
              url: 'https://fal.media/files/rabbit/8zL_aOu1Y3SPN4gXP1kto_f2b9ea9b5e174a1f9f0f732b8343dc60.png',
            },
          ],
          created: 1749644428,
        },
      },
      { status: 200 }
    )

    const result = await imageGenerator.generations({
      image_url,
      prompt,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Generation completed successfully',
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Generation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
