import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { Group, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'

import type { ImageItem } from '../types'

// 单个图片组件
interface CanvasImageProps {
  image: ImageItem
  onUpdate: (id: string, attrs: Partial<ImageItem>) => void
  onSelect: (id: string) => void
  isSelected: boolean
  currentTool?: string // 新增：当前工具类型
}

const primaryColor = '#3582FF'

const CanvasImage: React.FC<CanvasImageProps> = ({
  image,
  onUpdate,
  onSelect,
  isSelected,
  currentTool = 'select', // 默认为选择工具
}) => {
  const [img] = useImage(image.url, 'anonymous')
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [isHover, setIsHover] = useState(false)

  // 当前工具是否为手型工具
  const isHandTool = currentTool === 'hand'

  // 当选中状态改变时，更新 Transformer
  useEffect(() => {
    if (
      isSelected &&
      !isHandTool &&
      transformerRef.current &&
      imageRef.current
    ) {
      // 只有在非手型工具时才显示 transformer
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, isHandTool])

  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isHandTool) return // 手型工具时不显示 hover 效果

    setIsHover(true)
  }

  const handleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isHandTool) return

    setIsHover(false)
    const stage = e.target.getStage()
    if (stage) {
      const container = stage.container()
      container.style.cursor = 'default'
    }
  }

  const handleClick = () => {
    if (isHandTool) return // 手型工具时不能选择图片
    onSelect(image.id)
  }

  const handleDragStart = () => {
    if (isHandTool) return // 手型工具时不能拖拽图片
    onUpdate(image.id, { isDragging: true })
    setIsHover(false)
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (isHandTool) return

    onUpdate(image.id, {
      isDragging: false,
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleTransformEnd = () => {
    if (isHandTool) return // 手型工具时不能变换图片

    const node = imageRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    onUpdate(image.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(10, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  return (
    <Group>
      <KonvaImage
        ref={imageRef}
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        // 根据工具类型控制交互
        draggable={!isHandTool} // 手型工具时禁用拖拽
        listening={!isHandTool} // 手型工具时禁用所有事件监听
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTap={handleClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        // 样式效果 - 手型工具时不显示
        stroke={
          !isHandTool && isSelected
            ? primaryColor
            : !isHandTool && isHover
            ? primaryColor
            : undefined
        }
        strokeWidth={
          !isHandTool && (isSelected || isHover)
            ? 2
            : !isHandTool && isHover
            ? 2
            : 0
        }
        shadowColor={!isHandTool && isSelected ? primaryColor : undefined}
      />

      {/* Transformer 组件 - 只在选中且非手型工具时显示 */}
      {isSelected && !isHandTool && (
        <Transformer
          ref={transformerRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
              return oldBox
            }
            return newBox
          }}
          borderStroke={primaryColor}
          borderStrokeWidth={2}
          anchorStroke={primaryColor}
          anchorStrokeWidth={2}
          anchorFill='#ffffff'
          anchorSize={8}
          anchorCornerRadius={4}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
          rotateEnabled={false}
          keepRatio={false}
        />
      )}
    </Group>
  )
}

export { CanvasImage }
