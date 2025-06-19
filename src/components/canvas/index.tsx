'use client'

import Konva from 'konva'
import { useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'

import { CanvasImage } from './components/image'

import { ImageItem } from './types'

const CanvasPlayground = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const [images, setImages] = useState<ImageItem[]>([
    {
      id: '1',
      url: 'https://assets-persist.lovart.ai/agent_images/fa4ed330-0ad9-436e-a590-c0e9620f9340.png',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      isDragging: false,
    },
  ])

  // 更新图片属性
  const updateImage = (id: string, attrs: Partial<ImageItem>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...attrs } : img))
    )
  }

  // 选择图片
  const selectImage = (id: string) => {
    setSelectedId(id)
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      draggable
    >
      <Layer>
        {images.map((image) => (
          <CanvasImage
            key={image.id}
            image={image}
            onUpdate={updateImage}
            onSelect={selectImage}
          />
        ))}
      </Layer>
    </Stage>
  )
}

export { CanvasPlayground }
