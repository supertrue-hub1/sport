import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/admin/categories - Fetch all categories with news count
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST /api/admin/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, color, order } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const finalSlug = slug || generateSlug(name)

    // Check for duplicate name
    const existingName = await db.category.findUnique({ where: { name: name.trim() } })
    if (existingName) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 })
    }

    // Check for duplicate slug
    const existingSlug = await db.category.findUnique({ where: { slug: finalSlug } })
    if (existingSlug) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 })
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        color: color || '#6b7280',
        order: order ?? 0,
      },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

// PUT /api/admin/categories - Update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check for duplicate name if updating
    if (updateData.name && updateData.name !== existing.name) {
      const nameExists = await db.category.findUnique({ where: { name: updateData.name } })
      if (nameExists) {
        return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 })
      }
    }

    // Check for duplicate slug if updating
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await db.category.findUnique({ where: { slug: updateData.slug } })
      if (slugExists) {
        return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 })
      }
    }

    const updated = await db.category.update({
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
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE /api/admin/categories - Delete category (only if no news use it)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const existing = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { news: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (existing._count.news > 0) {
      return NextResponse.json(
        { error: `Cannot delete category: it has ${existing._count.news} news article(s) associated with it` },
        { status: 400 }
      )
    }

    await db.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
