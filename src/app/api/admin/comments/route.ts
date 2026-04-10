import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/comments - List all comments with author + news relations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { content: { contains: search } },
        { author: { name: { contains: search } } },
        { author: { email: { contains: search } } },
      ]
    }

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true, avatar: true, role: true },
          },
          news: {
            select: { id: true, title: true, slug: true },
          },
          parent: {
            select: { id: true, content: true },
          },
          replies: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// PUT /api/admin/comments - Update comment (approve/reject/status change)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }

    const existing = await db.comment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Validate status if provided
    if (updateData.status && !['pending', 'approved', 'rejected'].includes(updateData.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, approved, rejected' },
        { status: 400 },
      )
    }

    const updated = await db.comment.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        news: {
          select: { id: true, title: true, slug: true },
        },
        parent: {
          select: { id: true, content: true },
        },
        replies: {
          select: { id: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

// DELETE /api/admin/comments - Delete comment by id
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }

    const existing = await db.comment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    await db.comment.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
