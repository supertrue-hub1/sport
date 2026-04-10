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
    const totalPages = await db.page.count()
    const totalTags = await db.tag.count()
    const totalComments = await db.comment.count()
    const pendingComments = await db.comment.count({ where: { status: 'pending' } })
    const approvedComments = await db.comment.count({ where: { status: 'approved' } })
    const totalMedia = await db.media.count()

    // Media storage
    const mediaAgg = await db.media.aggregate({ _sum: { size: true } })
    const mediaStorageUsed = mediaAgg._sum.size ?? 0

    // News by status counts
    const newsByStatus = await db.news.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    // News by category (with category name and color)
    const newsByCategoryRaw = await db.news.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true },
    })

    const categoryIds = newsByCategoryRaw.map((item) => item.categoryId).filter(Boolean) as string[]
    const categories = await db.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true },
    })

    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    const newsByCategory = newsByCategoryRaw
      .filter((item) => item.categoryId)
      .map((item) => {
        const cat = categoryMap.get(item.categoryId!)
        return {
          name: cat?.name ?? 'Без категории',
          count: item._count.categoryId,
          color: cat?.color ?? '#6b7280',
        }
      })
      .sort((a, b) => b.count - a.count)

    // Recent activity (last 10)
    const recentActivity = await db.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
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
      totalPages,
      totalTags,
      totalComments,
      pendingComments,
      approvedComments,
      totalMedia,
      mediaStorageUsed,
      newsByStatus: newsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      newsByCategory,
      recentActivity,
      recentNews,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
