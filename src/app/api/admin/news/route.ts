import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/admin/news - Fetch all news with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (search) {
      where.title = { contains: search }
    }

    const news = await db.news.findMany({
      where,
      include: {
        author: {
          select: { id: true, email: true, name: true, role: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

// POST /api/admin/news - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, image, status, featured, authorId, categoryId, publishedAt } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!authorId || typeof authorId !== 'string' || authorId.trim().length === 0) {
      return NextResponse.json({ error: 'Author ID is required' }, { status: 400 })
    }

    // Verify author exists
    const author = await db.user.findUnique({ where: { id: authorId } })
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 400 })
    }

    // Verify category exists if provided
    if (categoryId) {
      const category = await db.category.findUnique({ where: { id: categoryId } })
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 400 })
      }
    }

    const finalSlug = slug || generateSlug(title)
    const finalStatus = status || 'draft'
    const finalPublishedAt = publishedAt || (finalStatus === 'published' ? new Date() : null)

    // Check for duplicate slug
    const existing = await db.news.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return NextResponse.json({ error: 'A news article with this slug already exists' }, { status: 400 })
    }

    const news = await db.news.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt || null,
        content: content || null,
        image: image || null,
        status: finalStatus,
        featured: featured || false,
        authorId,
        categoryId: categoryId || null,
        publishedAt: finalPublishedAt,
      },
      include: {
        author: {
          select: { id: true, email: true, name: true, role: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 })
  }
}

// PUT /api/admin/news - Update news
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    const existing = await db.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    // If updating slug, check for duplicates
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await db.news.findUnique({ where: { slug: updateData.slug } })
      if (slugExists) {
        return NextResponse.json({ error: 'A news article with this slug already exists' }, { status: 400 })
      }
    }

    // If updating status to published and no publishedAt, set it
    if (updateData.status === 'published' && !updateData.publishedAt && !existing.publishedAt) {
      updateData.publishedAt = new Date()
    }

    // If updating authorId, verify author exists
    if (updateData.authorId) {
      const author = await db.user.findUnique({ where: { id: updateData.authorId } })
      if (!author) {
        return NextResponse.json({ error: 'Author not found' }, { status: 400 })
      }
    }

    // If updating categoryId, verify category exists
    if (updateData.categoryId) {
      const category = await db.category.findUnique({ where: { id: updateData.categoryId } })
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 400 })
      }
    }

    const updated = await db.news.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, email: true, name: true, role: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 })
  }
}

// DELETE /api/admin/news - Delete news by id (from body)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    const existing = await db.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    await db.news.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 })
  }
}
