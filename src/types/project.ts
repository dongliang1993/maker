export interface Project {
  id: string
  name: string
  description: string
  user_id: string
  created_at: string
  updated_at: string
}

export type ImageList = {
  imageUrl: string
}[]

export type StyleList = {
  styleName: string
  styleCoverUrl: string
  imagePrompt: string
}[]
