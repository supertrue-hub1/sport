'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

/* ── mock news data ── */
const allNews = [
  { id: 1, title: 'Патрик Махо́мс обновил рекорд передач в сезоне', category: 'NFL', categoryColor: 'bg-red-100 text-red-700', status: 'published', date: '2025-01-15' },
  { id: 2, title: 'Леброн Джеймс побил рекорд Карима Абдул-Джаббара', category: 'NBA', categoryColor: 'bg-orange-100 text-orange-700', status: 'published', date: '2025-01-14' },
  { id: 3, title: 'Шо́хей Отани стал MVP обеих лиг MLB', category: 'MLB', categoryColor: 'bg-sky-100 text-sky-700', status: 'draft', date: '2025-01-13' },
  { id: 4, title: 'Коннор Макдэвид признан лучшим игроком NHL', category: 'NHL', categoryColor: 'bg-cyan-100 text-cyan-700', status: 'published', date: '2025-01-12' },
  { id: 5, title: 'Драфт 2025: топ-прогнозы и главные перспективы', category: 'NFL', categoryColor: 'bg-red-100 text-red-700', status: 'published', date: '2025-01-11' },
  { id: 6, title: 'Трансфер Джоша Аллена в Нью-Йорк Джетс', category: 'NFL', categoryColor: 'bg-red-100 text-red-700', status: 'draft', date: '2025-01-10' },
  { id: 7, title: 'Финал NBA: прогнозы и аналитика экспертов', category: 'NBA', categoryColor: 'bg-orange-100 text-orange-700', status: 'published', date: '2025-01-09' },
  { id: 8, title: 'Мировая серия 2025: предварительный обзор', category: 'MLB', categoryColor: 'bg-sky-100 text-sky-700', status: 'archived', date: '2025-01-08' },
  { id: 9, title: 'Звёзды NHL: топ-10 игроков сезона', category: 'NHL', categoryColor: 'bg-cyan-100 text-cyan-700', status: 'published', date: '2025-01-07' },
  { id: 10, title: 'Фэнтези футбол: лучшие подборки на неделю', category: 'NFL', categoryColor: 'bg-red-100 text-red-700', status: 'archived', date: '2025-01-06' },
]

const statusMap: Record<string, { label: string; color: string }> = {
  published: { label: 'Опубликовано', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Черновик', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Архив', color: 'bg-gray-100 text-gray-600' },
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function filterByStatus(news: typeof allNews, status: string) {
  if (status === 'all') return news
  return news.filter((n) => n.status === status)
}

function NewsCard({ item }: { item: (typeof allNews)[0] }) {
  const st = statusMap[item.status]
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className={`${item.categoryColor} text-[11px] px-2 py-0`}>
              {item.category}
            </Badge>
            <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>
              {st.label}
            </Badge>
            <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Pencil className="size-4" />
          </button>
          <button className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminNews() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 5

  const filtered = filterByStatus(allNews, tab).filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление новостями</h1>
          <p className="text-sm text-gray-500 mt-1">{allNews.length} новостей</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Plus className="size-4" />
          Добавить новость
        </Button>
      </div>

      {/* Search + Tabs */}
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
              <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Дата</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((item) => {
              const st = statusMap[item.status]
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-gray-900">{item.title}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${item.categoryColor} text-[11px] px-2 py-0`}>
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0`}>
                      {st.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(item.date)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <Pencil className="size-4" />
                      </button>
                      <button className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Нет результатов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
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
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="border-gray-200 text-gray-600"
            >
              Назад
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
                className={
                  p === page
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-gray-200 text-gray-600'
                }
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="border-gray-200 text-gray-600"
            >
              Вперёд
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
