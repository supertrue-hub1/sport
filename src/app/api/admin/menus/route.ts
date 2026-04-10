import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/menus - List all menu items with children, filter by menuType
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const menuType = searchParams.get('menuType') || 'main'

    const menuItems = await db.menuItem.findMany({
      where: { menuType },
      include: {
        page: {
          select: { id: true, title: true, slug: true },
        },
        children: {
          include: {
            page: {
              select: { id: true, title: true, slug: true },
            },
            children: {
              include: {
                page: {
                  select: { id: true, title: true, slug: true },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    // Only return top-level items (parentId === null)
    const topLevel = menuItems.filter((item) => item.parentId === null)

    return NextResponse.json(topLevel)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
  }
}

// POST /api/admin/menus - Create menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { label, url, pageId, target, order, parentId, menuType, enabled } = body

    if (!label || typeof label !== 'string' || label.trim().length === 0) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 })
    }

    if (!menuType || !['main', 'footer'].includes(menuType)) {
      return NextResponse.json({ error: 'Invalid menuType. Must be main or footer' }, { status: 400 })
    }

    // Validate target if provided
    if (target && !['_self', '_blank'].includes(target)) {
      return NextResponse.json({ error: 'Invalid target. Must be _self or _blank' }, { status: 400 })
    }

    // Validate parent if provided
    if (parentId) {
      const parent = await db.menuItem.findUnique({ where: { id: parentId } })
      if (!parent) {
        return NextResponse.json({ error: 'Parent menu item not found' }, { status: 400 })
      }
    }

    // Validate page if provided
    if (pageId) {
      const page = await db.page.findUnique({ where: { id: pageId } })
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 400 })
      }
    }

    // If order not specified, put at the end
    let finalOrder = order ?? 0
    if (!order) {
      const maxOrder = await db.menuItem.findFirst({
        where: { menuType, parentId: parentId || null },
        orderBy: { order: 'desc' },
        select: { order: true },
      })
      finalOrder = (maxOrder?.order ?? 0) + 1
    }

    const menuItem = await db.menuItem.create({
      data: {
        label: label.trim(),
        url: url || null,
        pageId: pageId || null,
        target: target || '_self',
        order: finalOrder,
        parentId: parentId || null,
        menuType,
        enabled: enabled ?? true,
      },
      include: {
        page: {
          select: { id: true, title: true, slug: true },
        },
        children: {
          include: {
            page: {
              select: { id: true, title: true, slug: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}

// PUT /api/admin/menus - Update menu item (reorder support)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
    }

    const existing = await db.menuItem.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }

    // Validate target if provided
    if (updateData.target && !['_self', '_blank'].includes(updateData.target)) {
      return NextResponse.json({ error: 'Invalid target. Must be _self or _blank' }, { status: 400 })
    }

    // Validate parent if provided
    if (updateData.parentId) {
      const parent = await db.menuItem.findUnique({ where: { id: updateData.parentId } })
      if (!parent) {
        return NextResponse.json({ error: 'Parent menu item not found' }, { status: 400 })
      }
      // Prevent circular reference
      if (updateData.parentId === id) {
        return NextResponse.json({ error: 'Menu item cannot be its own parent' }, { status: 400 })
      }
    }

    // Validate page if provided
    if (updateData.pageId) {
      const page = await db.page.findUnique({ where: { id: updateData.pageId } })
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 400 })
      }
    }

    const updated = await db.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        page: {
          select: { id: true, title: true, slug: true },
        },
        children: {
          include: {
            page: {
              select: { id: true, title: true, slug: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

// DELETE /api/admin/menus - Delete menu item
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
    }

    const existing = await db.menuItem.findUnique({
      where: { id },
      include: { children: { select: { id: true } } },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }

    // Cascade delete will handle children automatically (onDelete: Cascade in schema)
    await db.menuItem.delete({ where: { id } })

    return NextResponse.json({ success: true, deletedChildren: existing.children.length })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}
