type ImageProps = {
  url: string
  onPreview?: (url: string) => void
  alt?: string
}

export const Image = ({ alt, url, onPreview }: ImageProps) => {
  return (
    <div
      key={url}
      className='relative group'
      style={{
        display: 'inline-block',
        borderRadius: 'var(--radius-6)',
        overflow: 'hidden',
      }}
    >
      <img
        src={url}
        alt={alt}
        width={220}
        className='cursor-pointer hover:scale-110 transition-all duration-300 max-w-full max-h-full object-cover'
        onClick={() => onPreview?.(url)}
      />
      <div
        className='
        absolute left-0 bottom-0 right-0
        w-full h-8
        opacity-0 group-hover:opacity-100
        bg-black/40
        blur-md
        transition-all duration-300
      '
      />
    </div>
  )
}

export const ImageSkeleton = () => {
  return (
    <div className='relative group overflow-hidden rounded-xl'>
      <div
        className='w-[220px] h-[220px] rounded-xl pointer-events-none relative overflow-hidden'
        style={{
          backgroundColor: 'rgb(222, 234, 205)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translate(0px, 0px) rotate(0deg)',
        }}
      >
        {/* 🔥 简洁的从上到下白色光条 */}
        <div
          className='absolute inset-0 shimmer-effect'
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              rgba(255, 255, 255, 0.3) 30%,
              rgba(255, 255, 255, 0.8) 50%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )`,
            height: '80px',
            width: '100%',
          }}
        />
      </div>
    </div>
  )
}
