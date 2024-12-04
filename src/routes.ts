import { Hono } from 'hono'
import type { Bindings } from '@/index.ts'
import { Turnstile } from '@/middlewares/Turnstile'
import { Mail } from '@/controllers/Mail'

export const routes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post('/mail/send/', Turnstile.verify, Mail.send)
}
