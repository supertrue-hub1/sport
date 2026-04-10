import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/settings - Return all settings grouped
export async function GET() {
  try {
    const settings = await db.setting.findMany({
      orderBy: { group: 'asc' },
    })

    // Group by group field
    const grouped: Record<string, Record<string, string>> = {}
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = {}
      grouped[s.group][s.key] = s.value ?? ''
    }

    // Also return flat key-value map
    const flat: Record<string, string> = {}
    for (const s of settings) {
      flat[s.key] = s.value ?? ''
    }

    return NextResponse.json({ grouped, flat, settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/admin/settings - Upsert settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body as { settings: Record<string, string> }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings object' }, { status: 400 })
    }

    const results = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        db.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    )

    return NextResponse.json({ success: true, updated: results.length })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
