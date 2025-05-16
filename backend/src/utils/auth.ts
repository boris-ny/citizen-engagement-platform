import { Context } from 'hono'
import { sign, verify } from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production'

// Generate JWT token
export const generateToken = (payload: any) => {
  return sign(payload, JWT_SECRET)
}

// Verify JWT token
export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Auth middleware
export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401)
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  const payload = verifyToken(token)

  if (!payload) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401)
  }

  // Add citizen to context for later use
  c.set('citizen', payload)
  await next()
}
