'use client'

import Konva from 'konva'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'

import { CanvasImage } from './components/image'
import { ToolBar } from './components/tool-bar'

import { ImageItem } from './types'

const CanvasPlayground = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentTool, setCurrentTool] = useState('select')
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [history, setHistory] = useState<ImageItem[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)

  const stageRef = useRef<Konva.Stage>(null)

  const [images, setImages] = useState<ImageItem[]>([
    {
      id: '1',
      url: 'https://assets-persist.lovart.ai/agent_images/fa4ed330-0ad9-436e-a590-c0e9620f9340.png',
      x: 200,
      y: 150,
      width: 200,
      height: 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      isDragging: false,
    },
    {
      id: '2',
      url: 'https://picsum.photos/200/200?random=2',
      x: 450,
      y: 150,
      width: 180,
      height: 180,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      isDragging: false,
    },
  ])

  // 添加状态来跟踪滚动行为
  const [lastWheelEvent, setLastWheelEvent] = useState<{
    time: number
    deltaY: number
    deltaX: number
  } | null>(null)

  // 响应式调整大小
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setStageSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    updateSize()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }
  }, [])

  // 添加到历史记录
  const addToHistory = useCallback(
    (newImages: ImageItem[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push([...newImages])
        return newHistory.slice(-50) // 保持最多50个历史记录
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex]
  )

  // 更新图片属性
  const updateImage = (id: string, attrs: Partial<ImageItem>) => {
    if (currentTool === 'hand') return

    const newImages = images.map((img) =>
      img.id === id ? { ...img, ...attrs } : img
    )
    setImages(newImages)
    addToHistory(newImages)
  }

  // 选择图片
  const selectImage = (id: string) => {
    if (currentTool === 'hand') return
    setSelectedId(id)
  }

  // 工具栏处理函数
  const handleToolChange = (tool: string) => {
    setCurrentTool(tool)

    if (tool === 'hand') {
      setSelectedId(null)
      const stage = stageRef.current
      if (stage) {
        const container = stage.container()
        container.style.cursor = 'grab'
      }
    } else {
      const stage = stageRef.current
      if (stage) {
        const container = stage.container()
        container.style.cursor = 'default'
      }
    }
  }

  const handleZoomIn = () => {
    const stage = stageRef.current
    if (!stage) return

    const newScale = Math.min(5, stageScale * 1.2)
    const center = {
      x: stageSize.width / 2,
      y: stageSize.height / 2,
    }

    const mousePointTo = {
      x: (center.x - stage.x()) / stageScale,
      y: (center.y - stage.y()) / stageScale,
    }

    const newPos = {
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    }

    stage.scale({ x: newScale, y: newScale })
    stage.position(newPos)
    stage.batchDraw()

    setStageScale(newScale)
    setStagePosition(newPos)
  }

  const handleZoomOut = () => {
    const stage = stageRef.current
    if (!stage) return

    const newScale = Math.max(0.1, stageScale / 1.2)
    const center = {
      x: stageSize.width / 2,
      y: stageSize.height / 2,
    }

    const mousePointTo = {
      x: (center.x - stage.x()) / stageScale,
      y: (center.y - stage.y()) / stageScale,
    }

    const newPos = {
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    }

    stage.scale({ x: newScale, y: newScale })
    stage.position(newPos)
    stage.batchDraw()

    setStageScale(newScale)
    setStagePosition(newPos)
  }

  const handleZoomTo100 = () => {
    const stage = stageRef.current
    if (!stage) return

    stage.scale({ x: 1, y: 1 })
    stage.position({ x: 0, y: 0 })
    stage.batchDraw()

    setStageScale(1)
    setStagePosition({ x: 0, y: 0 })
  }

  const handleZoomTo200 = () => {
    const stage = stageRef.current
    if (!stage) return

    const center = {
      x: stageSize.width / 2,
      y: stageSize.height / 2,
    }

    stage.scale({ x: 2, y: 2 })
    stage.position({
      x: center.x - center.x * 2,
      y: center.y - center.y * 2,
    })
    stage.batchDraw()

    setStageScale(2)
    setStagePosition({
      x: center.x - center.x * 2,
      y: center.y - center.y * 2,
    })
  }

  const handleZoomToFit = () => {
    const stage = stageRef.current
    if (!stage || images.length === 0) return

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity

    images.forEach((img) => {
      minX = Math.min(minX, img.x)
      minY = Math.min(minY, img.y)
      maxX = Math.max(maxX, img.x + img.width)
      maxY = Math.max(maxY, img.y + img.height)
    })

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const padding = 100

    const scaleX = (stageSize.width - padding * 2) / contentWidth
    const scaleY = (stageSize.height - padding * 2) / contentHeight
    const scale = Math.min(scaleX, scaleY, 1)

    const newPos = {
      x: (stageSize.width - contentWidth * scale) / 2 - minX * scale,
      y: (stageSize.height - contentHeight * scale) / 2 - minY * scale + 50, // 考虑工具栏高度
    }

    stage.scale({ x: scale, y: scale })
    stage.position(newPos)
    stage.batchDraw()

    setStageScale(scale)
    setStagePosition(newPos)
  }

  const handleUndo = () => {
    console.log('undo', history, historyIndex)
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setImages([...history[newIndex]])
      setHistoryIndex(newIndex)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setImages([...history[newIndex]])
      setHistoryIndex(newIndex)
    }
  }

  const handleExport = () => {
    const stage = stageRef.current
    if (!stage) return

    // 导出为图片
    const dataURL = stage.toDataURL({
      pixelRatio: 2,
      quality: 1,
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.download = 'canvas-export.png'
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 处理鼠标滚轮缩放和触控板平移
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = stageRef.current
    if (!stage) return

    if (currentTool === 'hand') {
      const currentPos = stage.position()
      const sensitivity = 1

      const newPos = {
        x: currentPos.x - e.evt.deltaX * sensitivity,
        y: currentPos.y - e.evt.deltaY * sensitivity,
      }

      stage.position(newPos)
      stage.batchDraw()
      setStagePosition(newPos)
      return
    }

    const now = Date.now()
    const deltaY = e.evt.deltaY
    const deltaX = e.evt.deltaX

    // 更精确的触控板检测
    const isTouchpad = (() => {
      // 方法1: 检查 deltaMode (触控板通常是 0)
      if (e.evt.deltaMode !== 0) return false

      // 方法2: 检查 delta 值的大小 (触控板通常更小)
      if (Math.abs(deltaY) > 100) return false

      // 方法3: 检查是否有水平滚动 (触控板支持)
      if (Math.abs(deltaX) > 0) return true

      // 方法4: 检查连续事件的时间间隔 (触控板更频繁)
      if (lastWheelEvent) {
        const timeDiff = now - lastWheelEvent.time
        const deltaYDiff = Math.abs(deltaY - lastWheelEvent.deltaY)

        // 如果事件间隔很短且 delta 变化很小，可能是触控板
        if (timeDiff < 50 && deltaYDiff < 10) return true
      }

      // 方法5: 小的 deltaY 值通常是触控板
      return Math.abs(deltaY) < 20
    })()

    // 更新最后一次滚轮事件
    setLastWheelEvent({ time: now, deltaY, deltaX })

    if (isTouchpad) {
      // 触控板：执行平移操作
      const currentPos = stage.position()
      const newPos = {
        x: currentPos.x - e.evt.deltaX,
        y: currentPos.y - e.evt.deltaY,
      }

      stage.position(newPos)
      stage.batchDraw()
      setStagePosition(newPos)
    } else {
      // 鼠标滚轮：执行缩放操作
      const oldScale = stage.scaleX()
      const pointer = stage.getPointerPosition()
      if (!pointer) return

      const scaleBy = 1.05
      const direction = deltaY > 0 ? -1 : 1
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

      const clampedScale = Math.max(0.1, Math.min(5, newScale))

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      }

      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      }

      stage.scale({ x: clampedScale, y: clampedScale })
      stage.position(newPos)
      stage.batchDraw()

      setStageScale(clampedScale)
      setStagePosition(newPos)
    }
  }

  // 点击空白区域取消选择
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      if (currentTool !== 'hand') {
        setSelectedId(null)
      }
    }
  }

  // Stage 拖拽开始
  const handleStageDragStart = () => {
    const stage = stageRef.current
    if (stage && currentTool === 'hand') {
      const container = stage.container()
      container.style.cursor = 'grabbing'
    }
  }

  // Stage 拖拽结束
  const handleStageDragEnd = () => {
    const stage = stageRef.current
    if (stage && currentTool === 'hand') {
      const container = stage.container()
      container.style.cursor = 'grab'
      setStagePosition(stage.position())
    }
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'v':
          if (!e.ctrlKey && !e.metaKey) {
            setCurrentTool('select')
            e.preventDefault()
          }
          break
        case 'h':
          if (!e.ctrlKey && !e.metaKey) {
            handleToolChange('hand')
            e.preventDefault()
          }
          break
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault()
            handleZoomIn()
            break
          case '-':
            e.preventDefault()
            handleZoomOut()
            break
          case '0':
            e.preventDefault()
            handleZoomTo100()
            break
          case '1':
            e.preventDefault()
            handleZoomToFit()
            break
        }
      }

      if (currentTool === 'hand') return

      if (selectedId) {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            setImages((prev) => prev.filter((img) => img.id !== selectedId))
            setSelectedId(null)
            break
        }
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            handleUndo()
            e.preventDefault()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, currentTool])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <ToolBar
        currentTool={currentTool}
        zoomLevel={Math.round(stageScale * 100)}
        onToolChange={handleToolChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomToFit={handleZoomToFit}
        onZoomTo100={handleZoomTo100}
        onZoomTo200={handleZoomTo200}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
      />

      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        draggable={currentTool === 'hand'}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDragStart={handleStageDragStart}
        onDragEnd={handleStageDragEnd}
        style={{
          backgroundColor: '#f8f9fa',
          cursor: currentTool === 'hand' ? 'grab' : 'default',
        }}
      >
        <Layer>
          {images.map((image) => (
            <CanvasImage
              key={image.id}
              image={image}
              onUpdate={updateImage}
              onSelect={selectImage}
              isSelected={selectedId === image.id}
              currentTool={currentTool}
            />
          ))}
        </Layer>
      </Stage>

      {currentTool === 'hand' && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✋</span>
          <span>手型工具模式 - 只能移动画布</span>
        </div>
      )}
    </div>
  )
}

export { CanvasPlayground }
