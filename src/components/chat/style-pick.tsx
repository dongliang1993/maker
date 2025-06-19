import { CookieIcon, Cross2Icon } from '@radix-ui/react-icons'
import {
  Flex,
  Grid,
  IconButton,
  Popover,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import Image from 'next/image'
import { useState } from 'react'

import { PRESET_STYLES, type Style } from '@/constants/preset-styles'
import { cn } from '@/lib/utils'

type StylePickProps = {
  onStylePick: (style: Style | null) => void
}

const StylePick = ({ onStylePick }: StylePickProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const row = Math.ceil(PRESET_STYLES.length / 4)

  const handleStylePick = (style: Style) => {
    if (selectedStyle === style.id) {
      setSelectedStyle(null)
      onStylePick?.(null)
      return
    }

    setSelectedStyle(style.id)
    onStylePick?.(style)
  }

  const handleClose = () => {
    setSelectedStyle(null)
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton
          size='2'
          radius='large'
          variant='outline'
          color='gray'
          style={{ cursor: 'pointer', borderRadius: 'var(--radius-4)' }}
        >
          <Tooltip content='Pick a style'>
            <CookieIcon width='18' height='18' />
          </Tooltip>
        </IconButton>
      </Popover.Trigger>
      <Popover.Content width='700px' height='500px'>
        <Flex
          justify='between'
          align='center'
          className='h-10 mb-2 sticky top-0 bg-white'
        >
          <Text weight='medium'>Style Pick</Text>
          <Popover.Close onClick={handleClose}>
            <IconButton variant='ghost' size='2'>
              <Cross2Icon width='18' height='18' className='cursor-pointer' />
            </IconButton>
          </Popover.Close>
        </Flex>
        <Grid
          className='w-full h-full'
          columns='4'
          gap='3'
          rows={`repeat(${row}, auto)`}
        >
          {PRESET_STYLES.map((style) => (
            <div
              key={style.name}
              className={cn(
                'cursor-pointer hover:bg-gray-100 px-2 py-2 rounded-md h-[140px] box-border',
                selectedStyle === style.id &&
                  'bg-gray-100 border border-gray-200'
              )}
              onClick={() => {
                handleStylePick(style)
              }}
            >
              <Flex direction='column' align='center' justify='between' gap='3'>
                <Image
                  width={90}
                  height={90}
                  src={style.url}
                  alt={style.name}
                  className='object-cover rounded-md'
                />
                <Text weight='medium'>{style.name}</Text>
              </Flex>
            </div>
          ))}
        </Grid>
      </Popover.Content>
    </Popover.Root>
  )
}

export default StylePick
