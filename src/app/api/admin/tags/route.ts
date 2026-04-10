import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/admin/tags — list all tags with news count
export async function GET() {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: {
          select: { news: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

// POST /api/admin/tags — create tag with auto-slug
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, color } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 })
    }

    const finalSlug = slug || generateSlug(name)
    const finalColor = color || '#6b7280'

    // Check for duplicate name or slug
    const existingName = await db.tag.findUnique({ where: { name: name.trim() } })
    if (existingName) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 },
      )
    }

    const existingSlug = await db.tag.findUnique({ where: { slug: finalSlug } })
    if (existingSlug) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 },
      )
    }

    const tag = await db.tag.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        color: finalColor,
      },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

// PUT /api/admin/tags — update tag
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, slug, color } = body

    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    const existing = await db.tag.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    const updateData: Record<string, string> = {}

    if (name && name.trim() !== existing.name) {
      const nameExists = await db.tag.findUnique({ where: { name: name.trim() } })
      if (nameExists) {
        return NextResponse.json(
          { error: 'A tag with this name already exists' },
          { status: 400 },
        )
      }
      updateData.name = name.trim()
      // Regenerate slug if name changed and no explicit slug
      if (!slug) {
        const newSlug = generateSlug(name.trim())
        updateData.slug = newSlug
      }
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await db.tag.findUnique({ where: { slug } })
      if (slugExists) {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 400 },
        )
      }
      updateData.slug = slug
    }

    if (color) {
      updateData.color = color
    }

    const updated = await db.tag.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { news: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}

// DELETE /api/admin/tags — delete tag (check if used by news first)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    const existing = await db.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    if (existing._count.news > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag — it is used by ${existing._count.news} news article(s)`,
          usedByCount: existing._count.news,
        },
        { status: 400 },
      )
    }

    await db.tag.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
