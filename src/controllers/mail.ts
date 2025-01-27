import { Hono } from "hono"
import { utils } from "@/utils"
import { turnstile } from "@/middlewares/turnstile"
import { Resend } from "resend"
import { z } from 'zod'
import type { Bindings } from "@/index.ts"

const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  kana: z.string().min(1, 'カナは必須です').regex(/^[\p{Script=Hiragana}\p{Script=Katakana}ー々々]+$/u, 'カナは平仮名か片仮名で入力してください'),
  email: z.string().min(1, 'メールアドレスは必須です').email('無効なメールアドレスです'),
  message: z.string().min(1, 'メッセージは必須です'),
})

const app = new Hono<{ Bindings: Bindings }>().post("/send", turnstile, async (c) => {
  try {
    const body = await c.req.formData()
    const { name, kana, email, message } = await utils.cleansing(body, schema)

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

    if (error) return c.json({ error: 'Bad Request' }, 400)
    return c.json({ message: 'メール送信成功' }, 200)

  } catch (error: any) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default app
