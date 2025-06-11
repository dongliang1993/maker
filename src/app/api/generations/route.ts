import { NextResponse } from 'next/server'
import { imageAgent } from '@/lib/image-agent'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          message: 'Prompt is required',
        },
        { status: 400 }
      )
    }

    const result = await imageAgent.generations({
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
