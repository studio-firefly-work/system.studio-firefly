import { describe, it, expect } from 'vitest'
import app from '@/controllers/contact'

describe('GET /api/contact/hello', () => {
  it('should return a JSON response with message', async () => {
    const res = await app.request('/hello')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: 'Hello, world!' })
  })
})
