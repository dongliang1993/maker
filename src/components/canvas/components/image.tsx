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
}

const primaryColor = '#3582FF'

const CanvasImage: React.FC<CanvasImageProps> = ({
  image,
  onUpdate,
  onSelect,
}) => {
  const [img] = useImage(image.url, 'anonymous')
  const imageRef = useRef<Konva.Image>(null) // 修复类型定义
  const [isHover, setIsHover] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const transformerRef = useRef<Konva.Transformer>(null)

  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsHover(true)
  }

  const handleSelect = () => {
    setIsSelected(true)
    onSelect(image.id)
  }

  const handleTransformEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const node = imageRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // 重置缩放并更新宽高
    node.scaleX(1)
    node.scaleY(1)

    onUpdate(image.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  // 当选中状态改变时，更新 Transformer
  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      // 将 transformer 附加到选中的图片
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <Group>
      <KonvaImage
        ref={imageRef}
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        draggable
        onMouseOver={handleMouseOver}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={() => {
          onUpdate(image.id, { isDragging: true })
        }}
        onDragEnd={(e) => {
          onUpdate(image.id, {
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={handleTransformEnd}
        // 选中时的样式
        stroke={isSelected || isHover ? primaryColor : undefined}
        strokeWidth={isSelected || isHover ? 3 : 0}
        shadowColor={isHover ? primaryColor : undefined}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          flipEnabled={false} // 禁用翻转
          boundBoxFunc={(oldBox, newBox) => {
            // 限制最小尺寸
            if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
              return oldBox
            }
            return newBox
          }}
          // 自定义 Transformer 样式
          borderStroke={primaryColor}
          // borderStrokeWidth={3}
          anchorStroke={primaryColor}
          // anchorStrokeWidth={1}
          anchorFill='#ffffff'
          anchorSize={6}
          anchorCornerRadius={4}
          // 启用的控制点
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
          // 旋转控制点
          rotateEnabled={false}
          // 等比缩放（按住 Shift 键）
          keepRatio={false}
        />
      )}
    </Group>
  )
}

export { CanvasImage }
