import Image from 'next/image'

type LogoProps = {
  className?: string
  size?: 1 | 2 | 3
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

export const Logo = ({ size = 3 }: LogoProps) => {
  const sizeValue = sizeMap[size]
  const textSize = textSizeMap[size]

  return (
    <>
      <Image
        src='/icons/lightning.svg'
        alt='Maker'
        width={sizeValue}
        height={sizeValue}
        className='rounded'
      />
      <span className={`ml-2 text-[${textSize}px] font-bold`}>Maker</span>
    </>
  )
}
