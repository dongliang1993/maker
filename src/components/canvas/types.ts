// 图片项接口
export interface ImageItem {
  id: string
  url: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  isDragging: boolean
}
