import { Hono } from "hono";
import { turnstile } from "@/middlewares/turnstile";
import { Resend } from "resend";
import type { Bindings } from "@/index.ts";

const app = new Hono<{ Bindings: Bindings }>().post("/send", turnstile, async (c) => {
  try {
    const body = await c.req.formData();
    const [name, email, kana, message] = [body.get("name"), body.get("kana"), body.get("email"), body.get("message")];
    if (typeof name !== "string" || typeof kana !== "string" || typeof email !== "string" || typeof message !== "string") throw new Error("name, kana, email and message must be strings");

    console.log(name, email, kana);

    const resend = new Resend(c.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: c.env.EMAIL,
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
───────────────────────

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
    });
    return Response.json({ data, error });
  } catch (e: any) {
    return new Response(e.message);
  }
});

export default app;
