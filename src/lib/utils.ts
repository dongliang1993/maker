import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '')
}

export function generateUUID() {
  return crypto.randomUUID()
}

export const isFunction = (val: any) =>
  toString.call(val) === '[object Function]'

export const isImageTool = (toolName: string) => {
  return ['createImage', 'transformImage'].includes(toolName)
}
