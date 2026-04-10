'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  FileText,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PageOption {
  id: string
  title: string
  slug: string
}

interface MenuItemData {
  id: string
  label: string
  url: string | null
  pageId: string | null
  target: string
  order: number
  parentId: string | null
  menuType: string
  enabled: boolean
  createdAt: string
  page: { id: string; title: string; slug: string } | null
  children: MenuItemData[]
  labelPrefix?: string
}

interface MenuItemFormData {
  label: string
  url: string
  pageId: string
  target: string
  parentId: string
  enabled: boolean
}

const emptyForm: MenuItemFormData = {
  label: '',
  url: '',
  pageId: '',
  target: '_self',
  parentId: '',
  enabled: true,
}

export default function AdminMenus() {
  const [mainItems, setMainItems] = useState<MenuItemData[]>([])
  const [footerItems, setFooterItems] = useState<MenuItemData[]>([])
  const [pages, setPages] = useState<PageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [menuTab, setMenuTab] = useState('main')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<MenuItemFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [linkType, setLinkType] = useState<'url' | 'page'>('url')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MenuItemData | null>(null)
  const [deleting, setDeleting] = useState(false)

  const currentItems = menuTab === 'main' ? mainItems : footerItems
  const setCurrentItems = menuTab === 'main' ? setMainItems : setFooterItems

  const loadPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pages')
      if (res.ok) {
        const data = await res.json()
        setPages(Array.isArray(data) ? data : [])
      }
    } catch {
      // Pages API may not exist yet
    }
  }, [])

  const loadMenus = useCallback(async () => {
    setLoading(true)
    try {
      const [mainRes, footerRes] = await Promise.all([
        fetch('/api/admin/menus?menuType=main'),
        fetch('/api/admin/menus?menuType=footer'),
      ])
      if (mainRes.ok) {
        const data = await mainRes.json()
        setMainItems(Array.isArray(data) ? data : [])
      }
      if (footerRes.ok) {
        const data = await footerRes.json()
        setFooterItems(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMenus()
    loadPages()
  }, [loadMenus, loadPages])

  const openCreate = (parentId?: string) => {
    setEditingId(null)
    setForm({ ...emptyForm, parentId: parentId || '' })
    setLinkType('url')
    setDialogOpen(true)
  }

  const openEdit = (item: MenuItemData) => {
    setEditingId(item.id)
    setLinkType(item.pageId ? 'page' : 'url')
    setForm({
      label: item.label,
      url: item.url || '',
      pageId: item.pageId || '',
      target: item.target,
      parentId: item.parentId || '',
      enabled: item.enabled,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.label.trim()) return
    setSaving(true)
    try {
      const payload = {
        label: form.label.trim(),
        url: linkType === 'url' ? form.url.trim() : null,
        pageId: linkType === 'page' ? form.pageId || null : null,
        target: form.target,
        parentId: form.parentId || null,
        menuType: menuTab,
        enabled: form.enabled,
      }

      if (editingId) {
        const res = await fetch('/api/admin/menus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        if (res.ok) {
          const updated = await res.json()
          setCurrentItems((prev) =>
            prev.map((item) => {
              if (item.id === editingId) return updated
              if (item.children?.some((c) => c.id === editingId)) {
                return {
                  ...item,
                  children: item.children.map((c) =>
                    c.id === editingId ? updated : c,
                  ),
                }
              }
              return item
            }),
          )
        }
      } else {
        const res = await fetch('/api/admin/menus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          await loadMenus()
        }
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleEnabled = async (item: MenuItemData) => {
    try {
      const res = await fetch('/api/admin/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, enabled: !item.enabled }),
      })
      if (res.ok) {
        const updated = await res.json()
        setCurrentItems((prev) =>
          prev.map((i) => {
            if (i.id === item.id) return updated
            if (i.children?.some((c) => c.id === item.id)) {
              return {
                ...i,
                children: i.children.map((c) =>
                  c.id === item.id ? { ...c, enabled: !item.enabled } : c,
                ),
              }
            }
            return i
          }),
        )
      }
    } catch {
      // Silently fail
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/menus', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      if (res.ok) {
        setCurrentItems((prev) => prev.filter((i) => i.id !== deleteTarget.id))
      }
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  const handleMove = async (item: MenuItemData, direction: 'up' | 'down') => {
    const siblings = currentItems
    const idx = siblings.findIndex((i) => i.id === item.id)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === siblings.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const swapItem = siblings[swapIdx]

    try {
      await Promise.all([
        fetch('/api/admin/menus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, order: swapItem.order }),
        }),
        fetch('/api/admin/menus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: swapItem.id, order: item.order }),
        }),
      ])
      setCurrentItems((prev) => {
        const next = [...prev]
        next[idx] = swapItem
        next[swapIdx] = item
        return next
      })
    } catch {
      // Silently fail
    }
  }

  const handleMoveChild = async (
    parentItem: MenuItemData,
    childItem: MenuItemData,
    direction: 'up' | 'down',
  ) => {
    const idx = parentItem.children.findIndex((i) => i.id === childItem.id)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === parentItem.children.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const swapChild = parentItem.children[swapIdx]

    try {
      await Promise.all([
        fetch('/api/admin/menus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: childItem.id, order: swapChild.order }),
        }),
        fetch('/api/admin/menus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: swapChild.id, order: childItem.order }),
        }),
      ])
      setCurrentItems((prev) =>
        prev.map((p) => {
          if (p.id !== parentItem.id) return p
          const nextChildren = [...p.children]
          nextChildren[idx] = swapChild
          nextChildren[swapIdx] = childItem
          return { ...p, children: nextChildren }
        }),
      )
    } catch {
      // Silently fail
    }
  }

  // Parent options for the dialog (exclude current item and its children)
  const parentOptions = currentItems.filter((i) => i.id !== editingId)
  const allParentOptions = [
    ...parentOptions,
    ...parentOptions.flatMap((p) =>
      p.children
        .filter((c) => c.id !== editingId)
        .map((c) => ({ ...c, labelPrefix: `${p.label} → ` })),
    ),
  ]

  // Render helpers
  const getTypeBadge = (item: MenuItemData) => {
    const isExternal = !!item.url && !item.pageId
    const isInternal = !!item.pageId
    if (isExternal) return { label: 'Внешняя', cls: 'bg-orange-100 text-orange-600' }
    if (isInternal) return { label: 'Страница', cls: 'bg-blue-100 text-blue-600' }
    return { label: 'Пусто', cls: 'bg-gray-100 text-gray-500' }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-56" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" />
          </div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-44 shrink-0" />
        </div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-80" />
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-2 p-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Конструктор меню</h1>
          <p className="text-sm text-gray-500 mt-1">Управление навигацией сайта</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          onClick={() => openCreate()}
        >
          <Plus className="size-4 mr-2" />
          Добавить пункт
        </Button>
      </div>

      {/* Tabs: Main / Footer */}
      <Tabs value={menuTab} onValueChange={setMenuTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="main">Главное меню</TabsTrigger>
          <TabsTrigger value="footer">Подвал</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="mt-4">
          {renderMenuContent(mainItems, 'main')}
        </TabsContent>

        <TabsContent value="footer" className="mt-4">
          {renderMenuContent(footerItems, 'footer')}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingId(null)
        }}
      >
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Редактировать пункт меню' : 'Добавить пункт меню'}
            </DialogTitle>
            <DialogDescription>
              {menuTab === 'main' ? 'Главное меню' : 'Подвал'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="menu-label">Название *</Label>
              <Input
                id="menu-label"
                placeholder="Например: Новости"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>

            {/* Link Type */}
            <div className="space-y-2">
              <Label>Тип ссылки</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={linkType === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLinkType('url')}
                  className={
                    linkType === 'url'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'border-gray-200 text-gray-600'
                  }
                >
                  <ExternalLink className="size-3.5 mr-1.5" />
                  Внешняя ссылка
                </Button>
                <Button
                  type="button"
                  variant={linkType === 'page' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLinkType('page')}
                  className={
                    linkType === 'page'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'border-gray-200 text-gray-600'
                  }
                >
                  <FileText className="size-3.5 mr-1.5" />
                  Внутренняя страница
                </Button>
              </div>
            </div>

            {/* URL or Page select */}
            {linkType === 'url' ? (
              <div className="space-y-2">
                <Label htmlFor="menu-url">URL</Label>
                <Input
                  id="menu-url"
                  placeholder="https://example.com"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Страница</Label>
                <Select
                  value={form.pageId}
                  onValueChange={(v) => setForm((f) => ({ ...f, pageId: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите страницу" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.length === 0 && (
                      <SelectItem value="__none" disabled>
                        Нет доступных страниц
                      </SelectItem>
                    )}
                    {pages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Target */}
            <div className="space-y-2">
              <Label>Открывать в</Label>
              <Select
                value={form.target}
                onValueChange={(v) => setForm((f) => ({ ...f, target: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Текущем окне</SelectItem>
                  <SelectItem value="_blank">Новом окне</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parent */}
            <div className="space-y-2">
              <Label>Родительский пункт</Label>
              <Select
                value={form.parentId}
                onValueChange={(v) => setForm((f) => ({ ...f, parentId: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Нет (корневой пункт)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Нет (корневой пункт)</SelectItem>
                  {allParentOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.labelPrefix || ''}
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Enabled */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <Label className="cursor-pointer">Включён</Label>
                <p className="text-xs text-gray-400">Отображать в меню</p>
              </div>
              <Switch
                checked={form.enabled}
                onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={!form.label.trim() || saving}
            >
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Удалить пункт меню?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить.
              {deleteTarget && deleteTarget.children && deleteTarget.children.length > 0 && (
                <span className="block mt-2 text-red-500">
                  Дочерние пункты ({deleteTarget.children.length}) будут удалены
                  автоматически.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-700">
              «{deleteTarget.label}»
              {deleteTarget.url && (
                <span className="block text-xs text-gray-400 mt-1">
                  {deleteTarget.url}
                </span>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin mr-2" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderMenuContent(items: MenuItemData[], _menuType: string) {
    return (
      <>
        {/* Desktop list */}
        <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <div className="pl-4 w-5 shrink-0" />
            <div className="flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </div>
            <div className="w-16 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
              Порядок
            </div>
            <div className="w-9 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
              Статус
            </div>
            <div className="w-20 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
              Действия
            </div>
          </div>

          {/* Items */}
          {items.map((item) => (
            <div key={item.id}>
              {/* Parent row */}
              {renderDesktopRow(item, 0)}
              {/* Children rows */}
              {item.children.map((child) => renderDesktopRow(child, 1, item))}
              {/* Add child button */}
              <div className="pl-14 pr-4 py-1.5 border-b border-gray-50">
                <button
                  onClick={() => openCreate(item.id)}
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="size-3" />
                  Добавить подпункт
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="px-6 py-16 text-center text-gray-400">
              <ExternalLink className="size-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Пункты меню не найдены</p>
              <p className="text-sm mt-1">
                Нажмите &laquo;Добавить пункт&raquo;, чтобы создать первый
              </p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!item.enabled && (
                      <EyeOff className="size-3.5 text-gray-400 shrink-0" />
                    )}
                    {item.url && !item.pageId && (
                      <ExternalLink className="size-3.5 text-gray-400 shrink-0" />
                    )}
                    {item.pageId && (
                      <FileText className="size-3.5 text-blue-500 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${getTypeBadge(item).cls}`}
                    >
                      {getTypeBadge(item).label}
                    </Badge>
                    {item.target === '_blank' && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-600">
                        Новое окно
                      </Badge>
                    )}
                    {item.url && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">{item.url}</span>
                    )}
                    {item.page && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">/{item.page.slug}</span>
                    )}
                  </div>
                  {/* Children */}
                  {item.children.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {item.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between pl-3 border-l-2 border-blue-200 py-1.5"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {!child.enabled && (
                              <EyeOff className="size-3 text-gray-400 shrink-0" />
                            )}
                            <span className="text-sm text-gray-700 truncate">{child.label}</span>
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1 py-0 ${getTypeBadge(child).cls}`}
                            >
                              {getTypeBadge(child).label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => openEdit(child)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget(child)
                                setDeleteDialogOpen(true)
                              }}
                              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => openCreate(item.id)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    title="Добавить подпункт"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button
                    onClick={() => handleToggleEnabled(item)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100"
                    title={item.enabled ? 'Отключить' : 'Включить'}
                  >
                    {item.enabled ? (
                      <Eye className="size-4 text-green-500" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              {/* Mobile actions bar */}
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleMove(item, 'up')}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  onClick={() => handleMove(item, 'down')}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(item)
                    setDeleteDialogOpen(true)
                  }}
                  className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">
              <ExternalLink className="size-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Пункты меню не найдены</p>
              <p className="text-sm mt-1">
                Нажмите &laquo;Добавить пункт&raquo;, чтобы создать первый
              </p>
            </div>
          )}
        </div>
      </>
    )
  }

  function renderDesktopRow(item: MenuItemData, level: number, parentItem?: MenuItemData) {
    const isChild = level > 0
    const typeBadge = getTypeBadge(item)

    return (
      <div
        key={item.id}
        className={`group flex items-center gap-3 border-b border-gray-50 last:border-b-0 ${
          !item.enabled ? 'opacity-50' : ''
        }`}
      >
        {/* Drag handle */}
        <div className="pl-4 py-3 shrink-0">
          <GripVertical className="size-4 text-gray-300" />
        </div>

        {/* Indent for children */}
        {level > 0 && (
          <div
            className="shrink-0 border-l-2 border-blue-200"
            style={{ marginLeft: `${(level - 1) * 8}px`, paddingLeft: '12px' }}
          />
        )}

        {/* Label */}
        <div className="flex-1 min-w-0 py-3">
          <div className="flex items-center gap-2">
            {item.url && !item.pageId && (
              <ExternalLink className="size-3.5 text-gray-400 shrink-0" />
            )}
            {item.pageId && (
              <FileText className="size-3.5 text-blue-500 shrink-0" />
            )}
            <span className="text-sm font-medium text-gray-900 truncate">{item.label}</span>
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${typeBadge.cls}`}>
              {typeBadge.label}
            </Badge>
            {item.target === '_blank' && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-600">
                Новое окно
              </Badge>
            )}
          </div>
          {item.url && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.url}</p>
          )}
          {item.page && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">/{item.page.slug}</p>
          )}
        </div>

        {/* Order buttons */}
        <div className="flex items-center gap-0.5 shrink-0 py-3">
          <button
            onClick={() =>
              isChild && parentItem
                ? handleMoveChild(parentItem, item, 'up')
                : handleMove(item, 'up')
            }
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Вверх"
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            onClick={() =>
              isChild && parentItem
                ? handleMoveChild(parentItem, item, 'down')
                : handleMove(item, 'down')
            }
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Вниз"
          >
            <ArrowDown className="size-3.5" />
          </button>
        </div>

        {/* Toggle */}
        <div className="shrink-0 py-3">
          <button
            onClick={() => handleToggleEnabled(item)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={item.enabled ? 'Отключить' : 'Включить'}
            title={item.enabled ? 'Отключить' : 'Включить'}
          >
            {item.enabled ? (
              <Eye className="size-4 text-green-500" />
            ) : (
              <EyeOff className="size-4" />
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 py-3 pr-4">
          <button
            onClick={() => openEdit(item)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Редактировать"
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={() => {
              setDeleteTarget(item)
              setDeleteDialogOpen(true)
            }}
            className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Удалить"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    )
  }
}
