import { Context } from 'hono'
import turnstilePlugin from '@cloudflare/pages-plugin-turnstile'

export const Turnstile = {
  verify: (c: Context) => {
    turnstilePlugin({ secret: c.env.TURNSTILE_SECRET_KEY })
  }
}
