'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Search, Loader2, Star, Eye,
  Image as ImageIcon, X, CheckCircle, Tag, Globe, Link,
  Sparkles, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { useToast } from '@/hooks/use-toast'

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

interface UserItem {
  id: string
  name: string | null
  email: string
  role: string
  avatar: string | null
}

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  status: string
  featured: boolean
  authorId: string
  categoryId: string
  tagIds: string[]
  seoTitle: string
  seoDesc: string
  seoKeywords: string
}

const emptyForm: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  status: 'draft',
  featured: false,
  authorId: '',
  categoryId: '',
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

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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

// ──────────── News Editor Dialog ────────────

interface NewsEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingId: string | null
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  categories: Category[]
  tags: TagItem[]
  users: UserItem[]
  saving: boolean
  onSave: (status?: string) => void
  onToggleTag: (tagId: string) => void
}

function NewsEditorDialog({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  categories,
  tags,
  users,
  saving,
  onSave,
  onToggleTag,
}: NewsEditorDialogProps) {
  const [dialogTab, setDialogTab] = useState('main')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gray-100">
                {editingId ? (
                  <Pencil className="size-4 text-gray-600" />
                ) : (
                  <Plus className="size-4 text-gray-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingId ? 'Редактирование новости' : 'Создание новости'}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-0.5">
                  {editingId ? 'Измените данные новости' : 'Заполните данные для новой новости'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={dialogTab} onValueChange={setDialogTab} className="flex-1 min-h-0 flex flex-col">
            <div className="px-6 pt-3 shrink-0">
              <TabsList className="bg-gray-100 w-full">
                <TabsTrigger value="main" className="flex-1">
                  Основное
                </TabsTrigger>
                <TabsTrigger value="category" className="flex-1">
                  Категоризация
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex-1">
                  SEO
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6">
              {/* Tab 1: Main Content */}
              <TabsContent value="main" className="mt-4 pb-4">
                <div className="space-y-5">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-title" className="text-sm font-medium text-gray-700">
                      Заголовок <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="editor-title"
                      placeholder="Введите заголовок новости..."
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="h-11 border-gray-200 focus-visible:border-gray-400 text-base"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-slug" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Link className="size-3.5 text-gray-400" />
                      ЧПУ-ссылка (slug)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">/news/</span>
                      <Input
                        id="editor-slug"
                        placeholder="auto-generated-slug"
                        value={form.slug}
                        onChange={(e) => updateField('slug', e.target.value)}
                        className="pl-16 h-9 border-gray-200 focus-visible:border-gray-400 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-excerpt" className="text-sm font-medium text-gray-700">
                      Краткое описание
                    </Label>
                    <Textarea
                      id="editor-excerpt"
                      placeholder="Краткое описание для превью (лид-абзац)..."
                      value={form.excerpt}
                      onChange={(e) => updateField('excerpt', e.target.value)}
                      rows={2}
                      className="border-gray-200 focus-visible:border-gray-400 resize-none text-sm"
                    />
                    <p className="text-xs text-gray-400">{form.excerpt.length} символов</p>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-content" className="text-sm font-medium text-gray-700">
                      Содержание
                    </Label>
                    <Textarea
                      id="editor-content"
                      placeholder="Полный текст новости. Поддерживается Markdown-разметка: **жирный**, *курсив*, # заголовки, - списки..."
                      value={form.content}
                      onChange={(e) => updateField('content', e.target.value)}
                      rows={10}
                      className="border-gray-200 focus-visible:border-gray-400 resize-y text-sm font-mono leading-relaxed"
                    />
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">**текст**</code> — жирный
                      </span>
                      <span className="flex items-center gap-1">
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">*текст*</code> — курсив
                      </span>
                      <span className="flex items-center gap-1">
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">#</code> — заголовок
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{form.content.length} символов</p>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-image" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-gray-400" />
                      Изображение
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="editor-image"
                        placeholder="URL изображения..."
                        value={form.image}
                        onChange={(e) => updateField('image', e.target.value)}
                        className="flex-1 h-9 border-gray-200 focus-visible:border-gray-400 text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-600 shrink-0"
                        onClick={() => setMediaPickerOpen(true)}
                      >
                        <ImageIcon className="size-4 mr-1.5" />
                        Выбрать
                      </Button>
                    </div>
                    {form.image && (
                      <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200 w-full max-w-xs">
                        <img
                          src={form.image}
                          alt="Предпросмотр"
                          className="w-full h-auto max-h-40 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).style.display = 'block'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => updateField('image', '')}
                          className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Status */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Статус</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => updateField('status', v)}
                    >
                      <SelectTrigger className="border-gray-200 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Черновик</SelectItem>
                        <SelectItem value="published">Опубликована</SelectItem>
                        <SelectItem value="archived">Архив</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="size-4 text-amber-500" />
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">Рекомендуемая</Label>
                        <p className="text-xs text-gray-400">Показывать на главной</p>
                      </div>
                    </div>
                    <Switch
                      checked={form.featured}
                      onCheckedChange={(v) => updateField('featured', v)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Categorization */}
              <TabsContent value="category" className="mt-4 pb-4">
                <div className="space-y-5">
                  {/* Author */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Автор <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.authorId}
                      onValueChange={(v) => updateField('authorId', v)}
                    >
                      <SelectTrigger className="border-gray-200 h-9">
                        <SelectValue placeholder="Выберите автора" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name || user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {users.length === 0 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Нет доступных авторов
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Категория <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.categoryId}
                      onValueChange={(v) => updateField('categoryId', v)}
                    >
                      <SelectTrigger className="border-gray-200 h-9">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <span
                                className="size-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              {cat.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categories.length === 0 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Нет доступных категорий
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Tag className="size-4" />
                      Теги
                      {form.tagIds.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] bg-gray-200 text-gray-700 ml-1">
                          {form.tagIds.length}
                        </Badge>
                      )}
                    </Label>
                    {tags.length === 0 ? (
                      <p className="text-xs text-gray-400 py-2">Нет доступных тегов</p>
                    ) : (
                      <div className="space-y-1 max-h-64 overflow-y-auto pr-1 rounded-lg border border-gray-200 bg-gray-50/30 p-2">
                        {tags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={form.tagIds.includes(tag.id)}
                              onCheckedChange={() => onToggleTag(tag.id)}
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
                </div>
              </TabsContent>

              {/* Tab 3: SEO */}
              <TabsContent value="seo" className="mt-4 pb-4">
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="size-4" />
                    <span>Настройте мета-теги для поисковых систем</span>
                  </div>

                  {/* SEO Title */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-seo-title" className="text-sm font-medium text-gray-700">
                      SEO Заголовок
                    </Label>
                    <Input
                      id="editor-seo-title"
                      placeholder="Мета-заголовок (до 70 символов)"
                      value={form.seoTitle}
                      onChange={(e) => updateField('seoTitle', e.target.value)}
                      maxLength={70}
                      className="h-9 border-gray-200 focus-visible:border-gray-400 text-sm"
                    />
                    <p className="text-xs text-gray-400">{form.seoTitle.length}/70</p>
                  </div>

                  {/* SEO Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-seo-desc" className="text-sm font-medium text-gray-700">
                      SEO Описание
                    </Label>
                    <Textarea
                      id="editor-seo-desc"
                      placeholder="Мета-описание (до 160 символов)"
                      value={form.seoDesc}
                      onChange={(e) => updateField('seoDesc', e.target.value)}
                      maxLength={160}
                      rows={3}
                      className="border-gray-200 focus-visible:border-gray-400 resize-none text-sm"
                    />
                    <p className="text-xs text-gray-400">{form.seoDesc.length}/160</p>
                  </div>

                  {/* SEO Keywords */}
                  <div className="space-y-1.5">
                    <Label htmlFor="editor-seo-keywords" className="text-sm font-medium text-gray-700">
                      Ключевые слова
                    </Label>
                    <Input
                      id="editor-seo-keywords"
                      placeholder="Через запятую: НФЛ, футбол, матч"
                      value={form.seoKeywords}
                      onChange={(e) => updateField('seoKeywords', e.target.value)}
                      className="h-9 border-gray-200 focus-visible:border-gray-400 text-sm"
                    />
                  </div>

                  {/* SEO Preview */}
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Предпросмотр</Label>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-1">
                      <p className="text-sm text-blue-700 font-medium truncate">
                        {form.seoTitle || form.title || 'Заголовок страницы'}
                      </p>
                      <p className="text-xs text-green-700 font-mono truncate">
                        sportshub.ru/news/{form.slug || 'slug-novosti'}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {form.seoDesc || form.excerpt || 'Описание страницы будет отображаться здесь...'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 shrink-0 gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 text-gray-600"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Отмена
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 text-gray-600"
                onClick={() => onSave('draft')}
                disabled={saving || !form.title.trim()}
              >
                {saving ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <CheckCircle className="size-4 mr-1.5" />}
                Черновик
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onSave('published')}
                disabled={saving || !form.title.trim() || !form.authorId || !form.categoryId}
              >
                {saving ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Plus className="size-4 mr-1.5" />}
                Опубликовать
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Picker */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => updateField('image', url)}
        currentUrl={form.image}
      />
    </>
  )
}

// ──────────── Main Component ────────────

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 8
  const { toast } = useToast()

  // Editor dialog
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  // ──────────── Data Loading ────────────

  const loadData = useCallback(async () => {
    try {
      const [newsRes, catRes, tagRes, usersRes] = await Promise.all([
        fetch('/api/admin/news'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/tags'),
        fetch('/api/admin/users'),
      ])
      if (newsRes.ok) setNews(await newsRes.json())
      if (catRes.ok) setCategories(await catRes.json())
      if (tagRes.ok) setTags(await tagRes.json())
      if (usersRes.ok) setUsers(await usersRes.json())
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
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      image: item.image || '',
      status: item.status,
      featured: item.featured,
      authorId: item.authorId,
      categoryId: item.categoryId || '',
      tagIds: item.tags.map((t) => t.tagId),
      seoTitle: item.seoTitle || '',
      seoDesc: item.seoDesc || '',
      seoKeywords: item.seoKeywords || '',
    })
    setEditorOpen(true)
  }

  const handleSave = async (status?: string) => {
    if (!form.title.trim()) {
      toast({
        title: 'Ошибка валидации',
        description: 'Заголовок обязателен',
        variant: 'destructive',
      })
      return
    }
    if (!form.authorId) {
      toast({
        title: 'Ошибка валидации',
        description: 'Выберите автора',
        variant: 'destructive',
      })
      return
    }
    if (!form.categoryId) {
      toast({
        title: 'Ошибка валидации',
        description: 'Выберите категорию',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const saveData = {
        ...form,
        status: status || form.status,
      }

      if (editingId) {
        const res = await fetch('/api/admin/news', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...saveData }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Ошибка обновления')
        }
        toast({
          title: 'Новость обновлена',
          description: `"${form.title}" успешно сохранена`,
        })
      } else {
        const res = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Ошибка создания')
        }
        toast({
          title: 'Новость создана',
          description: `"${form.title}" успешно добавлена`,
        })
      }
      await loadData()
      setEditorOpen(false)
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

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту новость? Это действие необратимо.')) return
    try {
      const res = await fetch('/api/admin/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast({
          title: 'Новость удалена',
          description: 'Новость успешно удалена',
        })
      }
      setNews((prev) => prev.filter((n) => n.id !== id))
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next })
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить новость',
        variant: 'destructive',
      })
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginated.map((n) => n.id)))
    }
  }

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch('/api/admin/news', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'published' }),
          })
        )
      )
      toast({
        title: 'Опубликовано',
        description: `${selectedIds.size} новостей опубликовано`,
      })
      await loadData()
      setSelectedIds(new Set())
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Удалить ${selectedIds.size} выбранных новостей? Это действие необратимо.`)) return
    setBulkLoading(true)
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch('/api/admin/news', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          })
        )
      )
      toast({
        title: 'Удалено',
        description: `${selectedIds.size} новостей удалено`,
      })
      await loadData()
      setSelectedIds(new Set())
    } finally {
      setBulkLoading(false)
    }
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
          Создать новость
        </Button>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="admin-bulk-bar flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <span className="text-sm font-medium text-blue-700">
            Выбрано: {selectedIds.size}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBulkPublish}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <CheckCircle className="size-4 mr-1.5" />}
              Опубликовать выбранные
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleBulkDelete}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Trash2 className="size-4 mr-1.5" />}
              Удалить выбранные
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-500 hover:text-gray-700"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

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
              <th className="w-10 px-3 py-3">
                <Checkbox
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
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
                <tr key={item.id} className={`${selectedIds.has(item.id) ? 'bg-blue-50/50' : ''} hover:bg-blue-50/30 transition-colors`}>
                  <td className="px-3 py-3.5">
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                    />
                  </td>
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
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
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

      {/* ──────────── NEWS EDITOR DIALOG ──────────── */}
      <NewsEditorDialog
        open={editorOpen}
        onOpenChange={(open) => {
          if (!open) setEditingId(null)
          setEditorOpen(open)
        }}
        editingId={editingId}
        form={form}
        setForm={setForm}
        categories={categories}
        tags={tags}
        users={users}
        saving={saving}
        onSave={handleSave}
        onToggleTag={toggleTag}
      />
    </div>
  )
}
