import { Hono } from "hono"
import { Resend } from "resend"
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { utils } from "@/utils"
import { turnstile } from "@/middlewares/turnstile"
import type { Bindings } from "@/index.ts"

// Resendのエラーコードがexportされていないため複製
const RESEND_ERROR_CODES_BY_KEY = {
  missing_required_field: 422,
  invalid_access: 422,
  invalid_parameter: 422,
  invalid_region: 422,
  rate_limit_exceeded: 429,
  missing_api_key: 401,
  invalid_api_Key: 403,
  invalid_from_address: 403,
  validation_error: 403,
  not_found: 404,
  method_not_allowed: 405,
  application_error: 500,
  internal_server_error: 500,
} as const

const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  kana: z.string().min(1, 'カナは必須です').regex(/^[\p{Script=Hiragana}\p{Script=Katakana}ー々々]+$/u, 'カナは平仮名か片仮名で入力してください'),
  email: z.string().min(1, 'メールアドレスは必須です').email('無効なメールアドレスです'),
  message: z.string().min(1, 'メッセージは必須です')
})

const app = new Hono<{ Bindings: Bindings }>()
  .post("/send", turnstile, zValidator('form', schema), async (c) => {
    try {
      const body = c.req.valid('form')
      const { name, kana, email, message } = utils.sanitize(body)
      console.log(name, kana, email, message)

      const resend = new Resend(c.env.RESEND_API_KEY)
      const { data, error } = await resend.emails.send({
        from: `スタジオfirefly <${c.env.EMAIL}>`,
        to: email,
        subject: "【スタジオfirefly】お問い合わせありがとうございます",
        text: `※このメールはシステムからの自動返信です

${name} 様
このたびはお問い合わせをいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けいたしました。
通常、3日以内にご連絡いたしますので、今しばらくお待ちくださいませ。

─── お問い合わせ内容 ───
お名前：${name}
フリガナ：${kana}
メールアドレス：${email}
お問い合わせ内容：
${message}


尚、お問い合わせ内容により返信までにお時間をいただく場合がございます。
あらかじめご了承くださいますようお願いいたします。

# -- SIGNATURE --
{
  "name": "スタジオfirefly",
  "contact": {
    "email": "${c.env.EMAIL}",
    "website": "https://studio-firefly.com",
  }
}
# --------------`,
      })

      if (error) return c.json(error, RESEND_ERROR_CODES_BY_KEY[error.name])
      else if (data) return c.json(data, 200)

    } catch (error: any) {
      return c.json(error)
    }
  })
  .get('/hello', (c) => c.json({ message: 'Hello, world!' }))

export default app
