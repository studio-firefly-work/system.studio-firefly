import { Hono } from 'hono'
import { cors } from 'hono/cors'
import contact from '@/controllers/contact'

export type Bindings = {
  CORS_ORIGIN: string
  TURNSTILE_SECRET_KEY: string
  RESEND_API_KEY: string
  EMAIL: string
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})

app.route('/contact', contact)

export default app
