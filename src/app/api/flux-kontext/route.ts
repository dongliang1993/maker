import { FluxKontextService } from '@/lib/flux-kontext'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const result = await FluxKontextService.textToImagePro({
    prompt: body.prompt,
    aspect_ratio: body.aspect_ratio,
    guidance_scale: body.guidance_scale,
    num_images: body.num_images,
    safety_tolerance: body.safety_tolerance,
    output_format: body.output_format,
    seed: body.seed,
  })

  return NextResponse.json(result)
}
