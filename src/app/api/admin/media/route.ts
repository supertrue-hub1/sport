import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { db } from '@/lib/db'

// GET /api/admin/media - Fetch all media files
export async function GET() {
  try {
    const media = await db.media.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

// POST /api/admin/media - Upload file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string) || null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique filename
    const ext = path.extname(file.name)
    const baseName = file.name.replace(ext, '').replace(/[^a-zA-Zа-яА-ЯёЁ0-9_-]/g, '_')
    const uniqueName = `${baseName}-${Date.now()}${ext}`

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Write file to disk
    const filePath = path.join(uploadDir, uniqueName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Get image dimensions if it's an image
    let width: number | null = null
    let height: number | null = null
    if (file.type.startsWith('image/')) {
      try {
        const metadata = await sharp(filePath).metadata()
        width = metadata.width ?? null
        height = metadata.height ?? null
      } catch {
        // Sharp may fail on non-image files, ignore
      }
    }

    // Create database record
    const media = await db.media.create({
      data: {
        filename: `/uploads/${uniqueName}`,
        alt,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        url: `/uploads/${uniqueName}`,
        folder: '/',
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}

// DELETE /api/admin/media - Delete media by id
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
    }

    const media = await db.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete file from disk
    try {
      const filePath = path.join(process.cwd(), 'public', media.filename)
      const { unlink } = await import('fs/promises')
      await unlink(filePath)
    } catch {
      // File may already be deleted, ignore
    }

    await db.media.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
