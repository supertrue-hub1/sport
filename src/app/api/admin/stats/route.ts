import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  try {
    const totalNews = await db.news.count()
    const publishedNews = await db.news.count({ where: { status: 'published' } })
    const draftNews = await db.news.count({ where: { status: 'draft' } })
    const featuredNews = await db.news.count({ where: { featured: true } })
    const totalCategories = await db.category.count()
    const totalUsers = await db.user.count()

    // News by status counts
    const newsByStatus = await db.news.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    // News by category
    const newsByCategory = await db.news.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true },
    })

    // Recent news (last 5)
    const recentNews = await db.news.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    })

    return NextResponse.json({
      totalNews,
      publishedNews,
      draftNews,
      featuredNews,
      totalCategories,
      totalUsers,
      newsByStatus: newsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      newsByCategory: newsByCategory.map((item) => ({
        categoryId: item.categoryId,
        count: item._count.categoryId,
      })),
      recentNews,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
