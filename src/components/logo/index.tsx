import Image from 'next/image'

import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  size?: 1 | 2 | 3
  hideText?: boolean
}

const sizeMap = {
  1: 10,
  2: 20,
  3: 30,
}

const textSizeMap = {
  1: 12,
  2: 16,
  3: 22,
}

export const Logo = ({ size = 3, hideText = false, className }: LogoProps) => {
  const sizeValue = sizeMap[size]
  const textSize = textSizeMap[size]

  return (
    <div className={cn('inline-flex items-center', className)}>
      <Image
        src='/icons/lightning.svg'
        alt='Maker'
        width={sizeValue}
        height={sizeValue}
        className='rounded'
      />
      {!hideText && (
        <span className={`ml-2 text-[${textSize}px] font-bold`}>Maker</span>
      )}
    </div>
  )
}
