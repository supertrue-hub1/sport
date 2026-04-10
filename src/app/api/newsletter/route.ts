import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Некорректный формат email' },
        { status: 400 }
      )
    }

    // Fetch or create the setting
    let setting = await db.setting.findUnique({
      where: { key: 'newsletter_subscribers' },
    })

    let subscribers: string[] = []
    if (setting?.value) {
      try {
        subscribers = JSON.parse(setting.value)
      } catch {
        subscribers = []
      }
    }

    // Check for duplicate
    const lowerEmail = email.toLowerCase().trim()
    if (subscribers.some((s) => s.toLowerCase() === lowerEmail)) {
      return NextResponse.json(
        { error: 'Этот email уже подписан' },
        { status: 409 }
      )
    }

    subscribers.push(lowerEmail)

    await db.setting.upsert({
      where: { key: 'newsletter_subscribers' },
      create: {
        key: 'newsletter_subscribers',
        value: JSON.stringify(subscribers),
        group: 'general',
        type: 'json',
      },
      update: {
        value: JSON.stringify(subscribers),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Вы успешно подписались на рассылку',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
