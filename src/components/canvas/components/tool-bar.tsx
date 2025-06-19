'use client'

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  Hand,
  MousePointer,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import React, { useState } from 'react'

interface ToolBarProps {
  currentTool?: string
  zoomLevel?: number
  onToolChange?: (tool: string) => void
  onZoomChange?: (zoom: number) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomToFit?: () => void
  onZoomTo100?: () => void
  onZoomTo200?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onExport?: () => void
}

const tools = [
  { id: 'select', icon: MousePointer, tooltip: '选择工具 (V)' },
  { id: 'hand', icon: Hand, tooltip: '抓手工具 (H)' },
  // { id: 'frame', icon: Square, tooltip: '框架工具 (F)' },
  // { id: 'shape', icon: Square, tooltip: '形状工具' },
]

const ToolButton = ({
  icon: Icon,
  isActive = false,
  onClick,
  tooltip,
  className = '',
}: {
  icon: React.ElementType
  isActive?: boolean
  onClick?: () => void
  tooltip?: string
  className?: string
}) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`
      cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
      hover:bg-gray-100 active:scale-95
      ${isActive ? 'bg-gray-100' : 'text-gray-600 hover:text-gray-800'}
      ${className}
    `}
  >
    <Icon size={16} />
  </button>
)

const ToolBar: React.FC<ToolBarProps> = ({
  currentTool = 'select',
  zoomLevel = 75,
  onToolChange,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onZoomTo100,
  onZoomTo200,
  onUndo,
  onRedo,
  onExport,
}) => {
  const [showZoomMenu, setShowZoomMenu] = useState(false)

  const Divider = () => <div className='w-px h-6 bg-gray-200 mx-1' />

  const ZoomMenu = () => (
    <div className='absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-50'>
      <button
        onClick={() => {
          onZoomIn?.()
          setShowZoomMenu(false)
        }}
        className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between'
      >
        <span>放大</span>
        <span className='text-gray-400'>⌘ +</span>
      </button>
      <button
        onClick={() => {
          onZoomOut?.()
          setShowZoomMenu(false)
        }}
        className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between'
      >
        <span>缩小</span>
        <span className='text-gray-400'>⌘ -</span>
      </button>
      <button
        onClick={() => {
          onZoomTo100?.()
          setShowZoomMenu(false)
        }}
        className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between'
      >
        <span>缩放到 100%</span>
        <span className='text-gray-400'>⌘ 0</span>
      </button>
      <button
        onClick={() => {
          onZoomTo200?.()
          setShowZoomMenu(false)
        }}
        className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between'
      >
        <span>缩放到 200%</span>
        <span className='text-gray-400'>⌘ 2</span>
      </button>
      <button
        onClick={() => {
          onZoomToFit?.()
          setShowZoomMenu(false)
        }}
        className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between'
      >
        <span>适应屏幕</span>
        <span className='text-gray-400'>⌘ 1</span>
      </button>
      <div className='border-t border-gray-100 my-1'></div>
      <div className='px-3 py-2'>
        <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
          <span>注释</span>
          <span className='text-gray-400'>Shift C</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span>3D 视图</span>
          <span className='text-gray-400'>Shift</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className='fixed top-6 left-0 right-0 w-full z-50 flex justify-center items-center'>
      <div
        className='flex bg-white h-12 items-center px-3 gap-1 shadow-lg'
        style={{
          border: '1px solid #E5E5E5',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        {/* 工具选择区域 */}
        <div className='flex items-center gap-1'>
          {tools.map((tool) => (
            <ToolButton
              key={tool.id}
              icon={tool.icon}
              isActive={currentTool === tool.id}
              onClick={() => onToolChange?.(tool.id)}
              tooltip={tool.tooltip}
            />
          ))}
        </div>

        {/* 撤销/重做 */}
        <div className='flex items-center gap-1'>
          <ToolButton icon={ArrowLeft} onClick={onUndo} tooltip='撤销 (⌘Z)' />
          <ToolButton icon={ArrowRight} onClick={onRedo} tooltip='重做 (⌘⇧Z)' />
        </div>

        {/* 缩放控制 */}
        <div className='flex items-center gap-1'>
          <ToolButton icon={ZoomOut} onClick={onZoomOut} tooltip='缩小' />

          <div className='relative'>
            <button
              onClick={() => setShowZoomMenu(!showZoomMenu)}
              className='flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <span className='text-sm font-medium text-gray-700'>
                {zoomLevel}%
              </span>
              <ChevronDown size={14} className='text-gray-500' />
            </button>

            {showZoomMenu && (
              <>
                <div
                  className='fixed inset-0 z-40'
                  onClick={() => setShowZoomMenu(false)}
                />
                <ZoomMenu />
              </>
            )}
          </div>

          <ToolButton icon={ZoomIn} onClick={onZoomIn} tooltip='放大' />
        </div>

        <Divider />

        {/* 播放和导出 */}
        <button
          onClick={onExport}
          className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-100 transition-colors text-sm font-medium cursor-pointer text-black'
        >
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  )
}

export { ToolBar }
