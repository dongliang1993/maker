import { z } from 'zod'

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(['text']),
})

export const postRequestBodySchema = z.object({
  projectId: z.string(),
  imageList: z.array(z.object({ imageUrl: z.string() })),
  styleList: z.array(
    z.object({
      styleName: z.string(),
      styleCoverUrl: z.string(),
      imagePrompt: z.string(),
    })
  ),
  content: z.string().min(1).max(2000),
  message: z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    role: z.enum(['user']),
    content: z.string().min(1).max(2000),
    parts: z.array(textPartSchema),
    experimental_attachments: z
      .array(
        z.object({
          url: z.string().url(),
          name: z.string().min(1).max(2000).optional(),
          contentType: z
            .enum(['image/png', 'image/jpg', 'image/jpeg'])
            .optional(),
        })
      )
      .optional(),
  }),
})

export type PostRequestBody = z.infer<typeof postRequestBodySchema>

export const messageSchema = z.object({
  projectId: z.string(),
  text: z.string(),
  imageList: z
    .array(
      z.object({
        imageUrl: z.string(),
      })
    )
    .optional(),
  styleList: z
    .array(
      z.object({
        styleName: z.string(),
        styleCoverUrl: z.string(),
        imagePrompt: z.string(),
      })
    )
    .optional(),
})
