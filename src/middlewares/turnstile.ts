import { createMiddleware } from 'hono/factory'
import type { TurnstileSuccess, TurnstileFailure } from '@cloudflare/pages-plugin-turnstile'

export const turnstile = createMiddleware(async (c, next) => {
  try {
    // Turnstileのトークンを取得
    const formData = await c.req.formData()
    const token = formData.get('cf-turnstile-response') as string
    const ip = c.req.header('CF-Connecting-IP') ?? ''

    if (!token) {
      console.log(`ip: ${ip}`)
      return c.json('Turnstile token is missing', 400)
    }

    // Turnstileの検証リクエストを送信
    const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const verificationBody = new URLSearchParams({
      secret: c.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    });
    const verifyResponse = await fetch(verificationUrl, {
      method: 'POST',
      body: verificationBody,
    });
    const verifyResponseJson: TurnstileSuccess | TurnstileFailure = await verifyResponse.json()

    if (!verifyResponseJson.success) {
      console.log(`error-codes: ${verifyResponseJson['error-codes']}`)
      return c.json(verifyResponseJson, 403)
    }

    // 検証成功後、次のミドルウェアへ
    await next()

  } catch (error: any) {
    console.error(error)
    return c.json(error.message, 500)
  }
})
