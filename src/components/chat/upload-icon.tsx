import { IconButton } from '@radix-ui/themes'
import { PlusIcon } from 'lucide-react'
import { useRef } from 'react'

const UploadIcon = ({
  isUploading,
  onImageUpload,
}: {
  isUploading: boolean
  onImageUpload: (file: File) => void
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      await onImageUpload(file)
    } catch (error) {
      console.error('上传图片失败:', error)
    }
  }

  return (
    <>
      <input
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <IconButton
        size='2'
        radius='full'
        variant='outline'
        color='gray'
        style={{ cursor: 'pointer' }}
        onClick={() => fileInputRef.current?.click()}
        loading={isUploading}
      >
        <PlusIcon width='18' height='18' />
      </IconButton>
    </>
  )
}

export default UploadIcon
