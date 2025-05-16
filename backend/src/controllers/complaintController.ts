import { Context } from 'hono'
import { prisma } from '@/utils/prisma'

// Create a new complaint (only authenticated citizens)
export const createComplaint = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { title, description, category, address } = body

    // Get citizen from auth middleware
    const citizenData = c.get('citizen')

    // Validate required fields
    if (!title || !description || !category) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Create complaint with authenticated citizen's ID
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category,
        address,
        citizenId: citizenData.id
      },
      include: {
        citizen: true
      }
    })

    return c.json(complaint, 201)
  } catch (error) {
    console.error('Error creating complaint:', error)
    return c.json({ error: 'Failed to create complaint' }, 500)
  }
}

// Get all complaints (remains public)
export const getComplaints = async (c: Context) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        agent: true
      }
    })
    return c.json(complaints)
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return c.json({ error: 'Failed to fetch complaints' }, 500)
  }
}

// Get a specific complaint by ID
export const getComplaintById = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        citizen: true,
        agent: true
      }
    })

    if (!complaint) {
      return c.json({ error: 'Complaint not found' }, 404)
    }

    return c.json(complaint)
  } catch (error) {
    console.error('Error fetching complaint:', error)
    return c.json({ error: 'Failed to fetch complaint' }, 500)
  }
}

// Update complaint (only owner)
export const updateComplaint = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { title, description, category, address } = body

    // Get citizen from auth middleware
    const citizenData = c.get('citizen')

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    })

    if (!complaint) {
      return c.json({ error: 'Complaint not found' }, 404)
    }

    // Check if the authenticated citizen owns this complaint
    if (complaint.citizenId !== citizenData.id) {
      return c.json({ error: 'Unauthorized - You can only update your own complaints' }, 403)
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        title,
        description,
        category,
        address
      }
    })

    return c.json(updatedComplaint)
  } catch (error) {
    console.error('Error updating complaint:', error)
    return c.json({ error: 'Failed to update complaint' }, 500)
  }
}

// Delete complaint (only owner)
export const deleteComplaint = async (c: Context) => {
  try {
    const id = c.req.param('id')

    // Get citizen from auth middleware
    const citizenData = c.get('citizen')

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    })

    if (!complaint) {
      return c.json({ error: 'Complaint not found' }, 404)
    }

    // Check if the authenticated citizen owns this complaint
    if (complaint.citizenId !== citizenData.id) {
      return c.json({ error: 'Unauthorized - You can only delete your own complaints' }, 403)
    }

    await prisma.complaint.delete({
      where: { id }
    })

    return c.json({ message: 'Complaint deleted successfully' })
  } catch (error) {
    console.error('Error deleting complaint:', error)
    return c.json({ error: 'Failed to delete complaint' }, 500)
  }
}

// Update complaint status
export const updateComplaintStatus = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status } = body

    if (!status) {
      return c.json({ error: 'Status is required' }, 400)
    }

    // Validate status is one of the enum values
    if (!['Submitted', 'InReview', 'Resolved'].includes(status)) {
      return c.json({ error: 'Invalid status value' }, 400)
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    })

    if (!complaint) {
      return c.json({ error: 'Complaint not found' }, 404)
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    })

    return c.json(updatedComplaint)
  } catch (error) {
    console.error('Error updating complaint status:', error)
    return c.json({ error: 'Failed to update complaint status' }, 500)
  }
}

// Get complaints by category
export const getComplaintsByCategory = async (c: Context) => {
  try {
    const category = c.req.param('category')

    const complaints = await prisma.complaint.findMany({
      where: { category },
      include: {
        citizen: true,
        agent: true
      }
    })

    return c.json(complaints)
  } catch (error) {
    console.error('Error fetching complaints by category:', error)
    return c.json({ error: 'Failed to fetch complaints by category' }, 500)
  }
}
