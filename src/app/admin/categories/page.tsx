'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Pencil, Trash2, Loader2, Tag, ArrowUpDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  order: number
  _count: { news: number }
}

interface CatForm { name: string; slug: string; color: string; order: number }

const emptyForm: CatForm = { name: '', slug: '', color: '#6b7280', order: 0 }

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function pluralNews(n: number): string {
  if (n === 0) return 'статей'
  if (n === 1) return 'статья'
  if (n < 5) return 'статьи'
  return 'статей'
}

export default function AdminCategories() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CatForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [sortAsc, setSortAsc] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      if (!res.ok) throw new Error('Ошибка загрузки категорий')
      const data = await res.json()
      setCategories(data)
    } catch {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить список категорий',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { loadData() }, [loadData])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => sortAsc ? a.order - b.order : b.order - a.order)
  }, [categories, sortAsc])

  const maxCount = Math.max(...categories.map((c) => c._count.news), 1)

  const updateFormName = (name: string) => {
    const newSlug = editingId ? form.slug : generateSlug(name)
    setForm((f) => ({ ...f, name, slug: newSlug }))
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (item: Category) => {
    setEditingId(item.id)
    setForm({ name: item.name, slug: item.slug, color: item.color, order: item.order })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: 'Ошибка валидации',
        description: 'Название категории обязательно',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || generateSlug(form.name),
        color: form.color,
        order: form.order,
      }

      if (editingId) {
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Ошибка обновления категории')
        }
        toast({
          title: 'Категория обновлена',
          description: `"${form.name}" успешно сохранена`,
        })
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Ошибка создания категории')
        }
        toast({
          title: 'Категория создана',
          description: `"${form.name}" успешно добавлена`,
        })
      }
      await loadData()
      setDialogOpen(false)
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Произошла ошибка при сохранении',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Ошибка удаления категории')
      }
      toast({
        title: 'Категория удалена',
        description: `"${deleteTarget.name}" успешно удалена`,
      })
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    } catch (err) {
      toast({
        title: 'Ошибка удаления',
        description: err instanceof Error ? err.message : 'Не удалось удалить категорию',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const openDelete = (item: Category) => {
    if (item._count.news > 0) {
      toast({
        title: 'Удаление невозможно',
        description: `В категории "${item.name}" ${item._count.news} ${pluralNews(item._count.news)}. Сначала удалите или перенесите статьи.`,
        variant: 'destructive',
      })
      return
    }
    setDeleteTarget(item)
  }

  // ─── Loading skeleton ───────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-4 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="size-8 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Main content ───────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление категориями</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} {categories.length === 1 ? 'категория' : categories.length < 5 ? 'категории' : 'категорий'}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" /> Добавить категорию
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Категория</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                  Порядок <ArrowUpDown className="size-3.5" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статьи</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="size-4 rounded-full shrink-0 ring-2 ring-offset-1" style={{ backgroundColor: cat.color, ringColor: cat.color }} />
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3.5 text-gray-500">{cat.order}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ backgroundColor: cat.color, width: `${Math.min(100, (cat._count.news / maxCount) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{cat._count.news}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(cat)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Редактировать"><Pencil className="size-4" /></button>
                    <button onClick={() => openDelete(cat)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="Удалить">
                      {cat._count.news > 0 ? <AlertTriangle className="size-4 text-amber-500" /> : <Trash2 className="size-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedCategories.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                <Tag className="size-10 mx-auto mb-3 opacity-30" />
                <p>Категории пока не созданы</p>
                <p className="text-xs mt-1">Нажмите «Добавить категорию» чтобы начать</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedCategories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[11px] px-2 py-0 bg-gray-100 text-gray-600">Порядок: {cat.order}</Badge>
                    <span className="text-xs text-gray-400">{cat._count.news} {pluralNews(cat._count.news)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(cat)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Pencil className="size-4" /></button>
                <button onClick={() => openDelete(cat)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  {cat._count.news > 0 ? <AlertTriangle className="size-4 text-amber-500" /> : <Trash2 className="size-4" />}
                </button>
              </div>
            </div>
            {cat._count.news > 0 && (
              <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ backgroundColor: cat.color, width: `${Math.min(100, (cat._count.news / maxCount) * 100)}%` }} />
              </div>
            )}
          </div>
        ))}
        {sortedCategories.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">
            <Tag className="size-10 mx-auto mb-3 opacity-30" />
            <p>Категории пока не созданы</p>
            <p className="text-xs mt-1">Нажмите «Добавить категорию» чтобы начать</p>
          </div>
        )}
      </div>

      {/* ─── Create / Edit Dialog ───────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditingId(null) }}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Измените параметры категории' : 'Заполните информацию о новой категории'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Название *</Label>
              <Input
                id="cat-name"
                placeholder="NFL, NBA..."
                value={form.name}
                onChange={(e) => updateFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                placeholder="auto-generated"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-400">Генерируется автоматически из названия. Можно изменить вручную.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-color">Цвет</Label>
              <div className="flex items-center gap-3">
                <input
                  id="cat-color"
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="size-10 h-10 rounded-lg border border-gray-200 cursor-pointer bg-transparent"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="flex-1 font-mono text-sm"
                  placeholder="#6b7280"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-order">Порядок сортировки</Label>
              <Input
                id="cat-order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                className="w-32"
              />
              <p className="text-xs text-gray-400">Меньше значение = выше в списке</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={!form.name.trim() || saving}
            >
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Категория «{deleteTarget?.name}» будет удалена навсегда. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {deleting && <Loader2 className="size-4 animate-spin mr-2" />}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
