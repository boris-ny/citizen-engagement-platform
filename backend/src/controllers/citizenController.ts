import { Context } from 'hono'
import { prisma } from '@/utils/prisma'
import { generateToken } from '@/utils/auth'
import { compare, hash } from '@/utils/password'

// Register a new citizen
export const registerCitizen = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { name, email, password, phone, address } = body

    // Validate required fields
    if (!name || !email || !password) {
      return c.json({ error: 'Name, email and password are required' }, 400)
    }

    // Check if email already exists
    const existingCitizen = await prisma.citizen.findUnique({
      where: { email }
    })

    if (existingCitizen) {
      return c.json({ error: 'Email already in use' }, 400)
    }

    // Hash password
    const hashedPassword = await hash(password)

    // Create citizen
    const citizen = await prisma.citizen.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address
      }
    })

    // Remove password from response
    const { password: _, ...citizenWithoutPassword } = citizen

    return c.json(citizenWithoutPassword, 201)
  } catch (error) {
    console.error('Error registering citizen:', error)
    return c.json({ error: 'Failed to register citizen' }, 500)
  }
}

// Login
export const loginCitizen = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Find citizen by email
    const citizen = await prisma.citizen.findUnique({
      where: { email }
    })

    if (!citizen) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isPasswordValid = await compare(password, citizen.password)

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate token
    const token = generateToken({
      id: citizen.id,
      name: citizen.name,
      email: citizen.email
    })

    // Remove password from response
    const { password: _, ...citizenWithoutPassword } = citizen

    return c.json({
      citizen: citizenWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return c.json({ error: 'Failed to login' }, 500)
  }
}

// Get citizen profile
export const getCitizenProfile = async (c: Context) => {
  try {
    const citizenData = c.get('citizen')

    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenData.id },
      include: {
        complaints: true
      }
    })

    if (!citizen) {
      return c.json({ error: 'Citizen not found' }, 404)
    }

    // Remove password from response
    const { password: _, ...citizenWithoutPassword } = citizen

    return c.json(citizenWithoutPassword)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
}
