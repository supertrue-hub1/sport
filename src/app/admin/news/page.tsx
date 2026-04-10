'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Plus, Pencil, Trash2, Search, Loader2, Star, Eye,
  Image as ImageIcon, X, ChevronDown, Send, Save, Globe,
  Calendar, Tag, SearchIcon, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, linkPlugin, codeBlockPlugin } from '@mdxeditor/editor'
import type { MDXEditorMethods } from '@mdxeditor/editor'

// Dynamic MDXEditor import — no SSR
const MDXEditor = dynamic(
  () => import('@mdxeditor/editor').then((mod) => ({ default: mod.MDXEditor })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-100 rounded-lg h-64" />,
  }
)

// ──────────── Types ────────────

interface TagItem {
  id: string
  name: string
  slug: string
  color: string
  _count?: { news: number }
}

interface NewsTagRel {
  tagId: string
  createdAt: string
  tag: TagItem
}

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  image: string | null
  status: string
  featured: boolean
  authorId: string
  categoryId: string | null
  publishedAt: string | null
  views: number
  seoTitle: string | null
  seoDesc: string | null
  seoKeywords: string | null
  createdAt: string
  author: { id: string; name: string; email: string; role: string; avatar: string | null } | null
  category: { id: string; name: string; slug: string; color: string } | null
  tags: NewsTagRel[]
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
  image: string
  categoryId: string
  status: string
  featured: boolean
  tagIds: string[]
  seoTitle: string
  seoDesc: string
  seoKeywords: string
}

const emptyForm: FormData = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  categoryId: '',
  status: 'draft',
  featured: false,
  tagIds: [],
  seoTitle: '',
  seoDesc: '',
  seoKeywords: '',
}

const statusMap: Record<string, { label: string; color: string }> = {
  published: { label: 'Опубликовано', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Черновик', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Архив', color: 'bg-gray-100 text-gray-600' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

// ──────────── Tag Badges ────────────

function TagBadges({ tags, max = 3 }: { tags: NewsTagRel[]; max?: number }) {
  const visible = tags.slice(0, max)
  const more = tags.length - max
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((t) => (
        <Badge
          key={t.tagId}
          variant="secondary"
          className="text-[10px] px-1.5 py-0 font-medium"
          style={{ backgroundColor: `${t.tag.color}20`, color: t.tag.color }}
        >
          {t.tag.name}
        </Badge>
      ))}
      {more > 0 && (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-500">
          +{more}
        </Badge>
      )}
    </div>
  )
}

// ──────────── Main Component ────────────

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 8

  // Editor sheet
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const editorRef = useRef<MDXEditorMethods>(null)

  // Media picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  // ──────────── Data Loading ────────────

  const loadData = useCallback(async () => {
    try {
      const [newsRes, catRes, tagRes] = await Promise.all([
        fetch('/api/admin/news'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/tags'),
      ])
      if (newsRes.ok) setNews(await newsRes.json())
      if (catRes.ok) setCategories(await catRes.json())
      if (tagRes.ok) setTags(await tagRes.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ──────────── Filtering & Pagination ────────────

  const filtered = news
    .filter((n) => tab === 'all' || n.status === tab)
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  // ──────────── CRUD Handlers ────────────

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setEditorOpen(true)
  }

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content || '',
      image: item.image || '',
      categoryId: item.categoryId || '',
      status: item.status,
      featured: item.featured,
      tagIds: item.tags.map((t) => t.tagId),
      seoTitle: item.seoTitle || '',
      seoDesc: item.seoDesc || '',
      seoKeywords: item.seoKeywords || '',
    })
    setEditorOpen(true)
  }

  const handleSave = async (status?: string) => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const saveData = {
        ...form,
        status: status || form.status,
      }
      if (editingId) {
        await fetch('/api/admin/news', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...saveData }),
        })
      } else {
        await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...saveData,
            authorId: 'cmns4wsuo0000ivi5in538ewa',
          }),
        })
      }
      await loadData()
      setEditorOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту новость? Это действие необратимо.')) return
    try {
      await fetch('/api/admin/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setNews((prev) => prev.filter((n) => n.id !== id))
    } catch { /* ignore */ }
  }

  const toggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  // ──────────── Loading Skeleton ────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-64" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" />
          </div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-44 shrink-0" />
        </div>
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 rounded-lg h-9 w-64" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-9 w-72" />
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-2 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ──────────── Render ────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление новостями</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} {filtered.length === 1 ? 'новость' : filtered.length < 5 ? 'новости' : 'новостей'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Добавить новость
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по заголовку..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="h-9 pl-9 border-gray-200 bg-gray-50 focus-visible:bg-white"
          />
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
              <th className="text-left px-4 py-3 font-medium text-gray-500">Теги</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Просмотры</th>
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
                      <span className="font-medium text-gray-900 truncate max-w-[240px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {item.category ? (
                      <Badge
                        variant="secondary"
                        className="text-[11px] px-2 py-0"
                        style={{ backgroundColor: `${item.category.color}18`, color: item.category.color }}
                      >
                        {item.category.name}
                      </Badge>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    {item.tags.length > 0 ? (
                      <TagBadges tags={item.tags} />
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>{st.label}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-gray-500">
                      <Eye className="size-3" />
                      <span className="text-xs">{formatNumber(item.views)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Редактировать"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Нет результатов
                </td>
              </tr>
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
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.featured && <Star className="size-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                    <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.category && (
                      <Badge
                        variant="secondary"
                        className="text-[11px] px-2 py-0"
                        style={{ backgroundColor: `${item.category.color}18`, color: item.category.color }}
                      >
                        {item.category.name}
                      </Badge>
                    )}
                    {item.tags.length > 0 && <TagBadges tags={item.tags} max={2} />}
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>{st.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" /> {formatNumber(item.views)}
                    </span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(item)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {paginated.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">
            Нет результатов
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Показано {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} из {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="border-gray-200 text-gray-600">
              Назад
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
                className={p === page ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-200 text-gray-600'}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="border-gray-200 text-gray-600">
              Вперёд
            </Button>
          </div>
        </div>
      )}

      {/* ──────────── ARTICLE EDITOR SHEET ──────────── */}
      <Sheet open={editorOpen} onOpenChange={(open) => { if (!open) setEditingId(null); setEditorOpen(open) }}>
        <SheetContent
          side="right"
          className="w-full sm:w-[95vw] lg:w-[85vw] p-0 flex flex-col bg-white overflow-hidden"
          style={{ maxWidth: '1200px' }}
        >
          {/* Editor Header */}
          <SheetHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
            <SheetTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {editingId ? 'Редактирование статьи' : 'Новая статья'}
            </SheetTitle>
          </SheetHeader>

          {/* Editor Toolbar */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-200 text-gray-600"
                onClick={() => handleSave('draft')}
                disabled={!form.title.trim() || saving}
              >
                {saving ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Save className="size-4 mr-1.5" />}
                Сохранить черновик
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleSave('published')}
                disabled={!form.title.trim() || saving}
              >
                {saving ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Send className="size-4 mr-1.5" />}
                Опубликовать
              </Button>
            </div>
            {editingId && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  if (confirm('Удалить статью?')) {
                    handleDelete(editingId)
                    setEditorOpen(false)
                  }
                }}
              >
                <Trash2 className="size-4 mr-1.5" />
                Удалить
              </Button>
            )}
          </div>

          {/* Editor Body — 2 column layout */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Main Content Column */}
              <ScrollArea className="flex-1 h-full">
                <div className="p-6 space-y-6 max-w-3xl">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="news-title" className="text-sm font-medium text-gray-700">Заголовок *</Label>
                    <Input
                      id="news-title"
                      placeholder="Введите заголовок статьи..."
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="text-lg font-semibold h-12 border-gray-200 focus-visible:border-blue-500"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="news-excerpt" className="text-sm font-medium text-gray-700">Краткое описание</Label>
                    <Textarea
                      id="news-excerpt"
                      placeholder="Краткое описание для превью (лид-абзац)..."
                      value={form.excerpt}
                      onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                      rows={3}
                      className="border-gray-200 focus-visible:border-blue-500 resize-none"
                    />
                    <p className="text-xs text-gray-400">{form.excerpt.length} символов</p>
                  </div>

                  {/* Content — MDXEditor */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Содержание</Label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <MDXEditor
                        ref={editorRef}
                        className="mdxeditor-wrapper"
                        contentEditableClassName="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
                        onChange={(md) => setForm((f) => ({ ...f, content: md }))}
                        markdown={form.content}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          linkPlugin(),
                          codeBlockPlugin(),
                        ]}
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="news-image" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <ImageIcon className="size-4" />
                      Изображение
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="news-image"
                        placeholder="URL изображения..."
                        value={form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        className="flex-1 border-gray-200 focus-visible:border-blue-500"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-600 shrink-0"
                        onClick={() => setMediaPickerOpen(true)}
                      >
                        <SearchIcon className="size-4 mr-1.5" />
                        Выбрать
                      </Button>
                    </div>
                    {form.image && (
                      <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200 w-full max-w-md">
                        <img src={form.image} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                        <button
                          onClick={() => setForm((f) => ({ ...f, image: '' }))}
                          className="absolute top-2 right-2 size-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Sidebar Column */}
              <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50/30">
                <ScrollArea className="h-full">
                  <div className="p-5 space-y-5">
                    {/* Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Статус</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                      >
                        <SelectTrigger className="border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Черновик</SelectItem>
                          <SelectItem value="published">Опубликовано</SelectItem>
                          <SelectItem value="archived">Архив</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Категория</Label>
                      <Select
                        value={form.categoryId}
                        onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
                      >
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Без категории</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Featured */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-amber-500" />
                        <div>
                          <Label className="text-sm font-medium cursor-pointer">Рекомендуемая</Label>
                          <p className="text-xs text-gray-400">Показывать на главной</p>
                        </div>
                      </div>
                      <Switch
                        checked={form.featured}
                        onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                      />
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <Tag className="size-4" />
                        Теги
                        {form.tagIds.length > 0 && (
                          <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 ml-1">
                            {form.tagIds.length}
                          </Badge>
                        )}
                      </Label>
                      {tags.length === 0 ? (
                        <p className="text-xs text-gray-400">Нет доступных тегов</p>
                      ) : (
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                          {tags.map((tag) => (
                            <label
                              key={tag.id}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={form.tagIds.includes(tag.id)}
                                onCheckedChange={() => toggleTag(tag.id)}
                              />
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span
                                  className="size-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: tag.color }}
                                />
                                <span className="text-sm text-gray-700 truncate">{tag.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* Author Info */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Автор</Label>
                      <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-sm text-gray-700">Редактор СпортХаб</p>
                        <p className="text-xs text-gray-400">editor@sportshub.com</p>
                      </div>
                    </div>

                    {/* Published Date */}
                    {editingId && form.status === 'published' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          Дата публикации
                        </Label>
                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-sm text-gray-700">
                            {form.status === 'published' ? 'Опубликовано' : 'Не опубликовано'}
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator className="bg-gray-200" />

                    {/* SEO Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <Globe className="size-4" />
                        SEO-оптимизация
                      </Label>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="seo" className="border-gray-200">
                          <AccordionTrigger className="text-xs text-gray-500 py-2 hover:no-underline">
                            Настроить мета-теги
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-1">
                              <div className="space-y-1.5">
                                <Label className="text-xs text-gray-600">SEO Заголовок</Label>
                                <Input
                                  placeholder="Мета-заголовок (до 70 символов)"
                                  value={form.seoTitle}
                                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                                  maxLength={70}
                                  className="h-8 text-xs border-gray-200"
                                />
                                <p className="text-[10px] text-gray-400">{form.seoTitle.length}/70</p>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-gray-600">SEO Описание</Label>
                                <Textarea
                                  placeholder="Мета-описание (до 160 символов)"
                                  value={form.seoDesc}
                                  onChange={(e) => setForm((f) => ({ ...f, seoDesc: e.target.value }))}
                                  maxLength={160}
                                  rows={3}
                                  className="text-xs border-gray-200 resize-none"
                                />
                                <p className="text-[10px] text-gray-400">{form.seoDesc.length}/160</p>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-gray-600">Ключевые слова</Label>
                                <Input
                                  placeholder="Через запятую: НФЛ, футбол, матч"
                                  value={form.seoKeywords}
                                  onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                                  className="h-8 text-xs border-gray-200"
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Media Picker Dialog */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => setForm((f) => ({ ...f, image: url }))}
        currentUrl={form.image}
      />
    </div>
  )
}
