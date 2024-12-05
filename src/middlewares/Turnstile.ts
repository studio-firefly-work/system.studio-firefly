import { Context, Next } from 'hono'
import turnstilePlugin from '@cloudflare/pages-plugin-turnstile'

export const Turnstile = {
  verify: async (c: Context, next: Next) => {
    try {
      turnstilePlugin({ secret: c.env.TURNSTILE_SECRET_KEY })
      await next()
    } catch (e: any) {
      return new Response(e.message)
    }
  }
}
