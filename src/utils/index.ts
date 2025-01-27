import xss from 'xss'
import { z, ZodError } from 'zod'

/**
 * バリデーションとサニタイズ関数
 * @param body フォームに入力されたデータ
 * @param schema zodのバリデーションスキーマ
 * @returns 
 */
export const cleansing = async <T>(body: FormData, schema: z.ZodSchema<T>): Promise<T> => {
  try {
    // サニタイズ
    const sanitizedData: Record<string, any> = {}
    body.forEach((value, key) => {
      sanitizedData[key] = typeof value === 'string' ? xss(value) : value
    })

    // バリデーション
    return schema.parse(sanitizedData)

  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(", ")}`)
    }
    throw new Error("Unknown error occurred")
  }
}

export const utils = {
  cleansing
}
