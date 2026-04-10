import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// Simple session storage (in-memory for demo)
const sessions = new Map<string, { userId: string; expires: number }>()

function generateSessionToken(userId: string): string {
  const token = Buffer.from(`${userId}:${Date.now()}:${Math.random().toString(36)}`).toString('base64')
  sessions.set(token, { userId, expires: Date.now() + 24 * 60 * 60 * 1000 }) // 24h
  return token
}

function validateSession(token: string): { userId: string } | null {
  const session = sessions.get(token)
  if (!session) return null
  if (Date.now() > session.expires) {
    sessions.delete(token)
    return null
  }
  return { userId: session.userId }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { email } })

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    if (user.role === 'user') {
      return NextResponse.json(
        { error: 'Доступ запрещён. Недостаточно прав.' },
        { status: 403 }
      )
    }

    const token = generateSessionToken(user.id)
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Auth login error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (token) {
    sessions.delete(token)
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const session = validateSession(token)
    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true, user })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
