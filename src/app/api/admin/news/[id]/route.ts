import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/news/[id] - Fetch single news by ID with full relations
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    const news = await db.news.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news by ID:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

// DELETE /api/admin/news/[id] - Delete news by ID from URL param
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    const existing = await db.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    // Delete associated NewsTag entries first
    await db.newsTag.deleteMany({ where: { newsId: id } })
    await db.news.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news by ID:', error)
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 })
  }
}
