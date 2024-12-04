import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { routes } from '@/routes'

export type Bindings = {
  CORS_ORIGIN: string
  TURNSTILE_SECRET_KEY: string
  RESEND_API_KEY: string
  EMAIL: string
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})
routes(app)

export default app
