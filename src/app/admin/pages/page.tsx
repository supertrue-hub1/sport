'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, Loader2, Eye, Globe, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface PageItem {
  id: string
  title: string
  slug: string
  content: string | null
  image: string | null
  status: string
  order: number
  seoTitle: string | null
  seoDesc: string | null
  seoKeywords: string | null
  createdAt: string
  updatedAt: string
}

interface PageForm {
  title: string
  content: string
  status: string
  order: number
  seoTitle: string
  seoDesc: string
  seoKeywords: string
}

const emptyForm: PageForm = {
  title: '', content: '', status: 'draft', order: 0,
  seoTitle: '', seoDesc: '', seoKeywords: '',
}

const statusMap: Record<string, { label: string; color: string }> = {
  published: { label: 'Опубликовано', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Черновик', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Архив', color: 'bg-gray-100 text-gray-600' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Simple markdown to HTML renderer
function renderMarkdownToHtml(md: string): string {
  if (!md) return ''
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/g, '').replace(/```$/g, '')
      return `<pre><code>${code}</code></pre>`
    })
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Paragraphs: wrap non-tag lines
    .replace(/^(?!<[hupblo]|<li|<hr|<pre|<block)(.+)$/gm, '<p>$1</p>')

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')

  return html
}

export default function AdminPages() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PageForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewPage, setPreviewPage] = useState<PageItem | null>(null)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pages')
      if (res.ok) setPages(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = pages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (item: PageItem) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      content: item.content || '',
      status: item.status,
      order: item.order,
      seoTitle: item.seoTitle || '',
      seoDesc: item.seoDesc || '',
      seoKeywords: item.seoKeywords || '',
    })
    setDialogOpen(true)
  }

  const openPreview = (item: PageItem) => {
    setPreviewPage(item)
    setPreviewOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch('/api/admin/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        })
      } else {
        await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      await loadData()
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту страницу?')) return
    try {
      await fetch('/api/admin/pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setPages((prev) => prev.filter((p) => p.id !== id))
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-48" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" />
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-2 p-6">
            {[...Array(4)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Управление страницами</h1>
          <p className="text-sm text-gray-500 mt-1">{pages.length} страниц</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Добавить страницу
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск по названию или slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-9 border-gray-200 bg-gray-50 focus-visible:bg-white"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Название</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Порядок</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Дата</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((item) => {
              const st = statusMap[item.status] || statusMap.draft
              return (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5 text-gray-500">/{item.slug}</code>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>{st.label}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{item.order}</td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openPreview(item)} className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600" aria-label="Предпросмотр" title="Предпросмотр">
                        <Eye className="size-4" />
                      </button>
                      <button onClick={() => openEdit(item)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Редактировать">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Удалить">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Страницы не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((item) => {
          const st = statusMap[item.status] || statusMap.draft
          return (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <code className="text-[11px] bg-gray-100 rounded px-1.5 py-0.5 text-gray-400 mt-1 inline-block">/{item.slug}</code>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>{st.label}</Badge>
                    <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openPreview(item)} className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600">
                    <Eye className="size-4" />
                  </button>
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
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">Страницы не найдены</div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditingId(null) }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать страницу' : 'Новая страница'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="page-title">Название *</Label>
              <Input id="page-title" placeholder="Название страницы" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="published">Опубликовано</SelectItem>
                    <SelectItem value="archived">Архив</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-order">Порядок</Label>
                <Input id="page-order" type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-content">Содержание</Label>
              <Textarea
                id="page-content"
                placeholder="Содержание страницы (поддерживается Markdown)..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            {/* SEO Section */}
            <Accordion type="single" collapsible>
              <AccordionItem value="seo" className="border-gray-200">
                <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
                  SEO настройки
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="seo-title">Meta Title</Label>
                      <Input id="seo-title" placeholder="SEO заголовок" value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo-desc">Meta Description</Label>
                      <Textarea id="seo-desc" placeholder="SEO описание" value={form.seoDesc} onChange={(e) => setForm((f) => ({ ...f, seoDesc: e.target.value }))} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo-keywords">Meta Keywords</Label>
                      <Input id="seo-keywords" placeholder="ключевое1, ключевое2, ..." value={form.seoKeywords} onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

      {/* Preview Sheet */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[700px] p-0 flex flex-col bg-white overflow-hidden">
          <SheetHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
            <SheetTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Eye className="size-5 text-blue-600" />
              Предпросмотр: {previewPage?.title}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            {previewPage && (
              <div className="p-6">
                {/* Meta info */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className={`${(statusMap[previewPage.status] || statusMap.draft).color} text-[11px] px-2 py-0`}>
                    {(statusMap[previewPage.status] || statusMap.draft).label}
                  </Badge>
                  <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5 text-gray-500">/{previewPage.slug}</code>
                  <span className="text-xs text-gray-400">{formatDate(previewPage.updatedAt)}</span>
                </div>

                {/* Page title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{previewPage.title}</h1>

                {/* Rendered content */}
                {previewPage.content ? (
                  <div
                    className="admin-markdown-preview"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownToHtml(previewPage.content),
                    }}
                  />
                ) : (
                  <p className="text-gray-400 text-sm italic">Содержание пустое</p>
                )}

                {/* SEO info */}
                {(previewPage.seoTitle || previewPage.seoDesc || previewPage.seoKeywords) && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                      <Globe className="size-4 text-gray-400" />
                      SEO Мета-данные
                    </h3>
                    <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                      {previewPage.seoTitle && (
                        <div>
                          <span className="text-xs text-gray-400">Title:</span>
                          <p className="text-sm text-gray-700">{previewPage.seoTitle}</p>
                        </div>
                      )}
                      {previewPage.seoDesc && (
                        <div>
                          <span className="text-xs text-gray-400">Description:</span>
                          <p className="text-sm text-gray-700">{previewPage.seoDesc}</p>
                        </div>
                      )}
                      {previewPage.seoKeywords && (
                        <div>
                          <span className="text-xs text-gray-400">Keywords:</span>
                          <p className="text-sm text-gray-700">{previewPage.seoKeywords}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
