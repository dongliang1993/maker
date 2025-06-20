import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export const ThinkingMessage = () => {
  const role = 'assistant'

  return (
    <motion.div
      data-testid='message-assistant-loading'
      className='w-full mx-auto max-w-3xl group/message min-h-20'
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          'flex gap-2 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          }
        )}
      >
        <Logo size={2} hideText={true} />

        <div className='flex flex-col gap-2 w-full'>
          <div className='flex flex-col gap-4 text-muted-foreground font-bold'>
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  )
}
