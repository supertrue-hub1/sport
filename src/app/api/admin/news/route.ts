import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── GET ─── Fetch all news with optional filters, tags, and relations ───

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const tagId = searchParams.get('tagId')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }
    if (tagId) {
      where.tags = { some: { tagId } }
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
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true, color: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { comments: true },
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

// ─── POST ─── Create news article with tag connections ───

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      image,
      status,
      featured,
      authorId,
      categoryId,
      publishedAt,
      tagIds,
      seoTitle,
      seoDesc,
      seoKeywords,
    } = body

    // ── Validation ──
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Заголовок обязателен' }, { status: 400 })
    }
    if (!authorId || typeof authorId !== 'string' || authorId.trim().length === 0) {
      return NextResponse.json({ error: 'ID автора обязателен' }, { status: 400 })
    }

    // ── Verify relations ──
    const author = await db.user.findUnique({ where: { id: authorId } })
    if (!author) {
      return NextResponse.json({ error: 'Автор не найден' }, { status: 400 })
    }

    if (categoryId) {
      const category = await db.category.findUnique({ where: { id: categoryId } })
      if (!category) {
        return NextResponse.json({ error: 'Категория не найдена' }, { status: 400 })
      }
    }

    // Verify tag IDs exist
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const tagCount = await db.tag.count({ where: { id: { in: tagIds } } })
      if (tagCount !== tagIds.length) {
        return NextResponse.json({ error: 'Один или несколько тегов не найдены' }, { status: 400 })
      }
    }

    const finalSlug = slug || generateSlug(title)
    const finalStatus = status || 'draft'
    const finalPublishedAt = publishedAt || (finalStatus === 'published' ? new Date() : null)

    // Check for duplicate slug
    const existing = await db.news.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return NextResponse.json({ error: 'Новость с таким slug уже существует' }, { status: 400 })
    }

    // Build tag connections
    const tagsData =
      Array.isArray(tagIds) && tagIds.length > 0
        ? tagIds.map((tid: string) => ({ tagId: tid }))
        : []

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
        seoTitle: seoTitle || null,
        seoDesc: seoDesc || null,
        seoKeywords: seoKeywords || null,
        tags: { create: tagsData },
      },
      include: {
        author: {
          select: { id: true, email: true, name: true, role: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true, color: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { comments: true },
        },
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 })
  }
}

// ─── PUT ─── Update news with tag sync ───

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, tagIds, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID новости обязателен' }, { status: 400 })
    }

    const existing = await db.news.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 })
    }

    // Slug uniqueness check
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await db.news.findUnique({ where: { slug: updateData.slug } })
      if (slugExists) {
        return NextResponse.json({ error: 'Новость с таким slug уже существует' }, { status: 400 })
      }
    }

    // Auto-set publishedAt when transitioning to published
    if (updateData.status === 'published' && !updateData.publishedAt && !existing.publishedAt) {
      updateData.publishedAt = new Date()
    }

    // Verify author exists
    if (updateData.authorId) {
      const author = await db.user.findUnique({ where: { id: updateData.authorId } })
      if (!author) {
        return NextResponse.json({ error: 'Автор не найден' }, { status: 400 })
      }
    }

    // Verify category exists
    if (updateData.categoryId) {
      const category = await db.category.findUnique({ where: { id: updateData.categoryId } })
      if (!category) {
        return NextResponse.json({ error: 'Категория не найдена' }, { status: 400 })
      }
    }

    // Verify tag IDs when syncing
    if (Array.isArray(tagIds)) {
      if (tagIds.length > 0) {
        const tagCount = await db.tag.count({ where: { id: { in: tagIds } } })
        if (tagCount !== tagIds.length) {
          return NextResponse.json({ error: 'Один или несколько тегов не найдены' }, { status: 400 })
        }
      }
      // Sync tags: delete old, create new
      await db.newsTag.deleteMany({ where: { newsId: id } })
      if (tagIds.length > 0) {
        await db.newsTag.createMany({
          data: tagIds.map((tid: string) => ({ newsId: id, tagId: tid })),
        })
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
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true, color: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { comments: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 })
  }
}

// ─── DELETE ─── Delete news and associated tag connections ───

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID новости обязателен' }, { status: 400 })
    }

    const existing = await db.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 })
    }

    // Cascade handles NewsTag and Comment deletion via schema onDelete
    await db.news.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 })
  }
}
