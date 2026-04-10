'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, Tag, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface TagItem {
  id: string
  name: string
  slug: string
  color: string
  createdAt: string
  _count: { news: number }
}

interface TagForm {
  name: string
  color: string
}

const emptyForm: TagForm = { name: '', color: '#6b7280' }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminTags() {
  const [tags, setTags] = useState<TagItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TagForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tags')
      if (res.ok) setTags(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  const openEdit = (item: TagItem) => {
    setEditingId(item.id)
    setForm({ name: item.name, color: item.color })
    setError(null)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = editingId
        ? await fetch('/api/admin/tags', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingId, ...form }),
          })
        : await fetch('/api/admin/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Ошибка сохранения')
        return
      }
      await loadData()
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item: TagItem) => {
    if (item._count.news > 0) {
      setError(`Невозможно удалить тег «${item.name}» — используется в ${item._count.news} статье(ях)`)
      return
    }
    if (!confirm(`Удалить тег «${item.name}»?`)) return
    try {
      await fetch('/api/admin/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
      setTags((prev) => prev.filter((t) => t.id !== item.id))
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-48" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление тегами</h1>
          <p className="text-sm text-gray-500 mt-1">{tags.length} тегов</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Добавить тег
        </Button>
      </div>

      {/* Tags grid */}
      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="text-[11px] px-2 py-0"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      {item._count.news} статей
                    </Badge>
                    <code className="text-[10px] bg-gray-100 rounded px-1.5 py-0.5 text-gray-400 truncate">
                      {item.slug}
                    </code>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">{formatDate(item.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Редактировать"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className={`rounded-md p-2 ${
                      item._count.news > 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                    aria-label="Удалить"
                    title={item._count.news > 0 ? `Используется в ${item._count.news} статье(ях)` : 'Удалить'}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-16 text-center">
          <Tag className="size-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Теги не найдены</p>
          <p className="text-xs text-gray-400 mt-1">Создайте первый тег для организации контента</p>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-red-200 bg-white p-4 shadow-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Ошибка</p>
            <p className="text-xs text-gray-500 mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setEditingId(null); setError(null) } }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать тег' : 'Новый тег'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2">
                <AlertTriangle className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="tag-name">Название тега *</Label>
              <Input
                id="tag-name"
                placeholder="Например: NFL Playoffs"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-color">Цвет</Label>
              <div className="flex items-center gap-3">
                <input
                  id="tag-color"
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="size-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="flex-1 font-mono text-sm"
                  placeholder="#6b7280"
                />
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: `${form.color}18`, color: form.color }}
                >
                  Пример
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setDialogOpen(false); setError(null) }}>Отмена</Button>
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
