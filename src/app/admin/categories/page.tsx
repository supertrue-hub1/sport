'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  order: number
  _count: { news: number }
}

interface CatForm { name: string; color: string; order: number }

const emptyForm: CatForm = { name: '', color: '#6b7280', order: 0 }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CatForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) setCategories(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (item: Category) => { setEditingId(item.id); setForm({ name: item.name, color: item.color, order: item.order }); setDialogOpen(true) }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      } else {
        await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      }
      await loadData()
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, newsCount: number) => {
    if (newsCount > 0) { alert(`Нельзя удалить категорию — в ней ${newsCount} ${newsCount === 1 ? 'статья' : 'статей'}`); return }
    if (!confirm('Удалить категорию?')) return
    try {
      await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch {}
  }

  const maxCount = Math.max(...categories.map((c) => c._count.news), 1)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2"><div className="animate-pulse bg-gray-200 rounded-lg h-8 w-64" /><div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-32" />
              <div className="animate-pulse bg-gray-200 rounded-lg h-3 w-20" />
              <div className="animate-pulse bg-gray-200 rounded-lg h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление категориями</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} категорий</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" /> Добавить категорию
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Редактировать"><Pencil className="size-4" /></button>
                <button onClick={() => handleDelete(cat.id, cat._count.news)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Удалить"><Trash2 className="size-4" /></button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ backgroundColor: cat.color, width: `${Math.min(100, (cat._count.news / maxCount) * 100)}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-500 shrink-0">
                {cat._count.news} {cat._count.news === 1 ? 'статья' : cat._count.news < 5 ? 'статьи' : 'статей'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditingId(null) }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Название *</Label>
              <Input id="cat-name" placeholder="NFL, NBA..." value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-color">Цвет</Label>
              <div className="flex items-center gap-3">
                <input id="cat-color" type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="size-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                <Input value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="flex-1" placeholder="#6b7280" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={!form.name.trim() || saving}>
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
