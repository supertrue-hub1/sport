import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/news - Public news articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const categorySlug = searchParams.get('category')
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const featuredParam = searchParams.get('featured')

    const limit = Math.min(Math.max(parseInt(limitParam || '10') || 10, 1), 20)
    const offset = Math.max(parseInt(offsetParam || '0') || 0, 0)

    // Build where clause
    const where: Record<string, unknown> = { status: 'published' }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    if (featuredParam === 'true') {
      where.featured = true
    }

    const [articles, total] = await Promise.all([
      db.news.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          image: true,
          publishedAt: true,
          views: true,
          featured: true,
          category: {
            select: {
              name: true,
              slug: true,
              color: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  name: true,
                  slug: true,
                  color: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.news.count({ where }),
    ])

    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content ? article.content.substring(0, 200) : null,
      image: article.image,
      publishedAt: article.publishedAt,
      views: article.views,
      featured: article.featured,
      category: article.category,
      tags: article.tags.map((nt) => nt.tag),
      commentsCount: article._count.comments,
    }))

    return NextResponse.json({ data, total })
  } catch (error) {
    console.error('Public news API error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки новостей' },
      { status: 500 }
    )
  }
}
