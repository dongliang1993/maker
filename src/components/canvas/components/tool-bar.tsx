'use client'

import { Tooltip } from '@radix-ui/themes'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  Hand,
  MousePointer,
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
  { id: 'select', icon: MousePointer, tooltip: 'Select (V)' },
  { id: 'hand', icon: Hand, tooltip: 'Hand Tool (H)' },
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
  <Tooltip content={tooltip}>
    <button
      onClick={onClick}
      className={`
      cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
      active:scale-95
      ${isActive ? 'bg-gray-200' : 'text-gray-600 hover:bg-gray-100'}
      ${className}
    `}
    >
      <Icon size={16} />
    </button>
  </Tooltip>
)

const Divider = () => <div className='w-px h-6 bg-gray-200 mx-1' />

const ToolBar: React.FC<ToolBarProps> = ({
  currentTool = 'select',
  zoomLevel = 75,
  onToolChange,
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

  const ZoomMenu = () => (
    <div className='absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-50'>
      <button
        onClick={() => {
          onZoomOut?.()
          setShowZoomMenu(false)
        }}
        className='cursor-pointer w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors'
      >
        <span>Zoom In</span>
        <span className='text-gray-400'>⌘ -</span>
      </button>
      <button
        onClick={() => {
          onZoomIn?.()
          setShowZoomMenu(false)
        }}
        className='cursor-pointer w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors'
      >
        <span>Zoom Out</span>
        <span className='text-gray-400'>⌘ +</span>
      </button>
      <button
        onClick={() => {
          onZoomToFit?.()
          setShowZoomMenu(false)
        }}
        className='cursor-pointer w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors'
      >
        <span>Zoom to Fit</span>
        <span className='text-gray-400'>⌘ 1</span>
      </button>
      <button
        onClick={() => {
          onZoomTo100?.()
          setShowZoomMenu(false)
        }}
        className='cursor-pointer w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors'
      >
        <span>Zoom to 100%</span>
        <span className='text-gray-400'>⌘ 0</span>
      </button>
      <button
        onClick={() => {
          onZoomTo200?.()
          setShowZoomMenu(false)
        }}
        className='cursor-pointer w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors'
      >
        <span>Zoom to 200%</span>
        <span className='text-gray-400'>⌘ 2</span>
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
      <div className='flex bg-white h-12 items-center px-3 gap-1 shadow-lg border border-gray-200 rounded-[12px]'>
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

        {/* 缩放控制 */}
        <div className='relative flex items-center gap-1'>
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className='flex cursor-pointer bg-gray-200 items-center gap-1 px-2 py-1.5 rounded-lg transition-colors'
          >
            <span className='text-sm font-medium'>{zoomLevel}%</span>
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

        {/* 撤销/重做 */}
        <div className='flex items-center gap-1'>
          <ToolButton icon={ArrowLeft} onClick={onUndo} tooltip='撤销 (⌘Z)' />
          <ToolButton icon={ArrowRight} onClick={onRedo} tooltip='重做 (⌘⇧Z)' />
        </div>
        <Divider />

        {/* 导出按钮 */}
        <button
          onClick={onExport}
          className='flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer active:scale-95 bg-gray-200'
        >
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  )
}

export { ToolBar }
