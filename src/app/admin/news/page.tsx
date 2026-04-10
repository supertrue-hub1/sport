'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, Loader2, Eye, EyeOff, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/ui/switch'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/ui/select'
import { Label } from '@/components/ui/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/ui/tabs'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string | null
  status: string
  featured: boolean
  authorId: string
  categoryId: string | null
  publishedAt: string | null
  createdAt: string
  author: { id: string; name: string; email: string } | null
  category: { id: string; name: string; slug: string; color: string } | null
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
  _count: { news: number }
}

interface FormData {
  title: string
  excerpt: string
  content: string
  categoryId: string
  status: string
  featured: boolean
}

const emptyForm: FormData = { title: '', excerpt: '', content: '', categoryId: '', status: 'draft', featured: false }

const statusMap: Record<string, { label: string; color: string }> = {
  published: { label: 'Опубликовано', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Черновик', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Архив', color: 'bg-gray-100 text-gray-600' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 6

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [newsRes, catRes] = await Promise.all([
        fetch('/api/admin/news'),
        fetch('/api/admin/categories'),
      ])
      if (newsRes.ok) setNews(await newsRes.json())
      if (catRes.ok) setCategories(await catRes.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = news
    .filter((n) => tab === 'all' || n.status === tab)
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content || '',
      categoryId: item.categoryId || '',
      status: item.status,
      featured: item.featured,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch('/api/admin/news', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      } else {
        await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.title, excerpt: form.excerpt, content: form.content, status: form.status, featured: form.featured, authorId: 'cmns4wsuo0000ivi5in538ewa', categoryId: form.category || null }) })
      }
      await loadData()
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту новость?')) return
    try {
      await fetch('/api/admin/news', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      setNews((prev) => prev.filter((n) => n.id !== id))
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2"><div className="animate-pulse bg-gray-200 rounded-lg h-8 w-64" /><div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" /></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-36 shrink-0" />
        </div>
        <div className="space-y-2"><div className="animate-pulse bg-gray-200 rounded-lg h-9 w-64" /><div className="animate-pulse bg-gray-200 rounded-lg h-9 w-72" /></div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-2 p-6">{[...Array(5)].map((_, i) => <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление новостями</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} новостей</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Добавить новость
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Поиск по заголовку..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="h-9 pl-9 border-gray-200 bg-gray-50 focus-visible:bg-white" />
        </div>
        <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1) }}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="published">Опубликовано</TabsTrigger>
            <TabsTrigger value="draft">Черновик</TabsTrigger>
            <TabsTrigger value="archived">Архив</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Заголовок</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Категория</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Дата</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((item) => {
              const st = statusMap[item.status] || statusMap.draft
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      {item.featured && <Star className="size-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                      <span className="font-medium text-gray-900 truncate">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {item.category ? (
                      <Badge variant="secondary" className="text-[11px] px-2 py-0" style={{ backgroundColor: `${item.category.color}18`, color: '#fff' }}>
                        {item.category.name}
                      </Badge>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>{st.label}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Редактировать"><Pencil className="size-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Удалить"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Нет результатов</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.map((item) => {
          const st = statusMap[item.status] || statusMap.draft
          return (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.category && <Badge variant="secondary" className="text-[11px] px-2 py-0" style={{ backgroundColor: `${item.category.color}18`, color: '#fff' }}>{item.category.name}</Badge>}
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>{st.label}</Badge>
                    <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(item)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Pencil className="size-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          )
        })}
        {paginated.length === 0 && <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">Нет результатов</div>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Показано {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} из {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="border-gray-200 text-gray-600">Назад</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} className={p === page ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-200 text-gray-600'}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="border-gray-200 text-gray-600">Вперёд</Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditingId(null) }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать новость' : 'Добавить новость'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок *</Label>
              <Input id="title" placeholder="Введите заголовок новости" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Краткое описание</Label>
              <Textarea id="excerpt" placeholder="Краткое описание для превью" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Полный текст</Label>
              <Textarea id="content" placeholder="Полный текст статьи..." value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={6} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без категории</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="published">Опубликовано</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <Label className="cursor-pointer">Рекомендуемая</Label>
                <p className="text-xs text-gray-400">Показывать на главной</p>
              </div>
              <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={!form.title.trim() || saving}>
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
