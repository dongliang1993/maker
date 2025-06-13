import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

// 配置需要应用中间件的路径
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
