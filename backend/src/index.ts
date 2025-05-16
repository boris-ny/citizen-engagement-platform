import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { getCitizenProfile, loginCitizen, registerCitizen } from './controllers/citizenController'
import { authMiddleware } from './utils/auth'
import { createComplaint, deleteComplaint, getComplaintById, getComplaints, getComplaintsByCategory, updateComplaint, updateComplaintStatus } from './controllers/complaintController'

const app = new Hono()

app.use(prettyJSON())
app.use(cors())


app.get('/', (c) => {
  return c.json({ message: 'Citizen Complaint Management API' })
})

// Auth routes (public)
app.post('/api/auth/register', registerCitizen)
app.post('/api/auth/login', loginCitizen)

// Protected citizen routes
app.get('/api/citizen/profile', authMiddleware, getCitizenProfile)

// Complaint routes
app.get('/api/complaints', getComplaints) // Public - anyone can view complaints
app.get('/api/complaints/:id', getComplaintById) // Public
app.get('/api/complaints/category/:category', getComplaintsByCategory) // Public

// Protected complaint routes
app.post('/api/complaints', authMiddleware, createComplaint) // Only authenticated citizens
app.put('/api/complaints/:id', authMiddleware, updateComplaint) // Only complaint owners
app.delete('/api/complaints/:id', authMiddleware, deleteComplaint) // Only complaint owners
app.patch('/api/complaints/:id/status', authMiddleware, updateComplaintStatus) // Only complaint owners

export default {
  port: 5000,
  fetch: app.fetch,
} 
