// Simple password hashing and comparison using native crypto
import { createHash, randomBytes } from 'crypto'

// Generate a hash of password with salt
export const hash = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return `${salt}:${hash}`
}

// Compare password with stored hash
export const compare = async (password: string, storedHash: string): Promise<boolean> => {
  const [salt, hash] = storedHash.split(':')
  const calculatedHash = createHash('sha256').update(password + salt).digest('hex')
  return hash === calculatedHash
}
