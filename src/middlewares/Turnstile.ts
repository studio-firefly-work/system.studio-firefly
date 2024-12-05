import { createMiddleware } from 'hono/factory'
import turnstilePlugin from '@cloudflare/pages-plugin-turnstile'

export const turnstile = createMiddleware(async (c, next) => {
  try {
    turnstilePlugin({ secret: c.env.TURNSTILE_SECRET_KEY })
    await next()
  } catch (e: any) {
    return new Response(e.message)
  }
})
