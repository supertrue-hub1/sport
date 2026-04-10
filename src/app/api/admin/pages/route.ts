import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/admin/pages — list all pages ordered by order
export async function GET() {
  try {
    const pages = await db.page.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST /api/admin/pages — create page with auto-slug
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title, slug, content, image, status, order,
      seoTitle, seoDesc, seoKeywords,
    } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const finalSlug = slug || generateSlug(title)
    const finalStatus = status || 'draft'
    const finalOrder = order ?? 0

    // Check for duplicate slug
    const existing = await db.page.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 },
      )
    }

    const page = await db.page.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        content: content || null,
        image: image || null,
        status: finalStatus,
        order: finalOrder,
        seoTitle: seoTitle || null,
        seoDesc: seoDesc || null,
        seoKeywords: seoKeywords || null,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}

// PUT /api/admin/pages — update page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const existing = await db.page.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // If updating slug, check for duplicates
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await db.page.findUnique({ where: { slug: updateData.slug } })
      if (slugExists) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 },
        )
      }
    }

    // If title changed and no explicit slug provided, regenerate slug
    if (updateData.title && updateData.title !== existing.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title)
      // Check new slug
      const slugExists = await db.page.findUnique({ where: { slug: updateData.slug } })
      if (slugExists) {
        updateData.slug = `${updateData.slug}-${Date.now()}`
      }
    }

    const updated = await db.page.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

// DELETE /api/admin/pages — delete page
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const existing = await db.page.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    await db.page.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
