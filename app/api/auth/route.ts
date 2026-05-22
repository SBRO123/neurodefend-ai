import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'guardianai-dev-secret-change-in-production'

// Demo users (in production, use a real database)
const DEMO_USERS = [
  { id: '1', email: 'demo@guardianai.co.za', passwordHash: bcrypt.hashSync('demo1234', 10), role: 'student', name: 'Demo User' },
  { id: '2', email: 'admin@guardianai.co.za', passwordHash: bcrypt.hashSync('admin1234', 10), role: 'admin', name: 'Admin User' },
]

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const user = DEMO_USERS.find(u => u.email === email)
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
    return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
