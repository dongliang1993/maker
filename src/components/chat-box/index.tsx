import {
  ArrowUpIcon,
  Component1Icon,
  GlobeIcon,
  Link2Icon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'

export const ChatBox = () => {
  return (
    <Box
      style={{
        padding: '12px 16px',
        boxShadow: 'rgba(193, 193, 193, 0.25) 0px 4px 81.6px 0px',
        border: '1px solid #e9e9e9',
      }}
      className='fixed bottom-10 rounded-xl bg-white w-2/3 left-1/2 -translate-x-1/2'
    >
      <Flex direction='column' gap='3'>
        <TextArea
          placeholder='Please enter your design requirements...'
          size='2'
          variant='surface'
          resize='none'
        />
        <Flex justify='between' align='center'>
          <Flex gap='2'>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <PlusIcon width='18' height='18' />
            </IconButton>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <Link2Icon width='18' height='18' />
            </IconButton>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <GlobeIcon width='18' height='18' />
            </IconButton>
            <IconButton
              size='2'
              radius='full'
              variant='outline'
              color='gray'
              style={{ cursor: 'pointer' }}
            >
              <Component1Icon width='18' height='18' />
            </IconButton>
          </Flex>
          <IconButton size='2' radius='large' variant='soft'>
            <ArrowUpIcon width='20' height='20' />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  )
}
