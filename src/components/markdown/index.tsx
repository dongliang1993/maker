import { memo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components: Partial<Components> = {
  code: ({ node, className, children, ref, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !(props as any).inline && match ? (
      <pre
        {...props}
        className={`${className} text-sm w-full max-w-full overflow-x-auto p-3 rounded-lg mt-2 bg-zinc-800 text-white dark:bg-zinc-300 dark:text-black whitespace-pre break-all`}
      >
        <code
          className={match[1]}
          style={{
            wordBreak: 'break-all',
          }}
        >
          {children}
        </code>
      </pre>
    ) : (
      <code
        className={`${className} text-sm py-0.5 px-1 overflow-x-auto whitespace-pre-wrap rounded-md bg-zinc-800 text-white dark:bg-zinc-300 dark:text-black break-all`}
        {...props}
      >
        {children}
      </code>
    )
  },
  blockquote: ({ node, children, ...props }) => {
    return (
      <blockquote
        className='border-l-2 border-b-accent-foreground pl-2 mb-2'
        {...props}
      >
        {children}
      </blockquote>
    )
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className='list-decimal list-outside ml-4' {...props}>
        {children}
      </ol>
    )
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className='py-1' {...props}>
        {children}
      </li>
    )
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className='list-decimal list-outside ml-4' {...props}>
        {children}
      </ul>
    )
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className='font-semibold' {...props}>
        {children}
      </span>
    )
  },
  a: ({ node, children, ...props }) => {
    return (
      <a
        className='text-blue-500 hover:underline break-all'
        target='_blank'
        rel='noreferrer'
        {...props}
      >
        {children}
      </a>
    )
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className='text-3xl font-semibold mt-6 mb-2' {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className='text-2xl font-semibold mt-6 mb-2' {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className='text-xl font-semibold mt-6 mb-2' {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className='text-lg font-semibold mt-6 mb-2' {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className='text-base font-semibold mt-6 mb-2' {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className='text-sm font-semibold mt-6 mb-2' {...props}>
        {children}
      </h6>
    )
  },
}

const remarkPlugins = [remarkGfm]

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
)
