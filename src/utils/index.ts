import xss from 'xss';

/**
 * 入力データをサニタイズする関数
 * 
 * @template T - 入力オブジェクトの型
 * @param {T} inputs - サニタイズ対象の入力データ（オブジェクト形式）
 * @returns {T} - サニタイズ後のオブジェクト（入力データと同じ型）
 * 
 * 入力データ内の各プロパティの値が文字列型の場合、
 * DOMPurify を使って XSS（クロスサイトスクリプティング）攻撃を防ぐために
 * サニタイズ処理を行います。文字列以外の値はそのまま返します。
 */
const sanitize = <T extends Record<string, unknown>>(inputs: T): T => {
  return Object.fromEntries(
    Object.entries(inputs).map(([key, value]) => [
      key,
      typeof value === "string" ? xss(value) : value
    ])
  ) as T;
}

export const utils = {
  sanitize
}
