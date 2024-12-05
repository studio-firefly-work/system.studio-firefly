import { Hono } from "hono"
import {turnstile} from '@/middlewares/turnstile'
import { Resend } from "resend"
import type { Bindings } from '@/index.ts'

const app = new Hono<{ Bindings: Bindings }>()
  .post('/send', turnstile, async (c) => {
    try {
      const body = await c.req.formData()
      const [name, email] = [body.get("name"), body.get("email")]
      if (typeof name !== "string" || typeof email !== "string") throw new Error("Name and email must be strings")

      console.log(name, email)

      const resend = new Resend(c.env.RESEND_API_KEY)
      const { data, error } = await resend.emails.send({
        from: c.env.EMAIL,
        to: [email],
        subject: "Hello world",
        text: `Welcome ${name}`,
      })
      return Response.json({ data, error })

    } catch (e: any) {
      return new Response(e.message)
    }
  })

export default app