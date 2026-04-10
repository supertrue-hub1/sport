import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'

// GET /api/admin/media/[id] — get single media
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const media = await db.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }
    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

// DELETE /api/admin/media/[id] — delete media file from disk + DB record
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const media = await db.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete file from disk
    try {
      const filePath = path.join(process.cwd(), 'public', media.filename)
      await unlink(filePath)
    } catch {
      // File may already be deleted, ignore
    }

    // Delete database record
    await db.media.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
