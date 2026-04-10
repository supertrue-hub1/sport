'use client'

import { useState, useEffect } from 'react'
import {
  Newspaper, CheckCircle, FileEdit, FileText, MessageSquare, Image as ImageIcon,
  Plus, Upload, MessageCircle, ExternalLink, ArrowUpRight, ArrowDownRight, Minus,
  Clock, User, Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface StatsData {
  totalNews: number
  publishedNews: number
  draftNews: number
  featuredNews: number
  totalCategories: number
  totalUsers: number
  totalPages: number
  totalTags: number
  totalComments: number
  pendingComments: number
  approvedComments: number
  totalMedia: number
  mediaStorageUsed: number
  newsByStatus: { status: string; count: number }[]
  newsByCategory: { name: string; count: number; color: string }[]
  recentActivity: {
    id: string
    action: string
    entity: string
    details: string
    createdAt: string
    user?: { name?: string } | null
  }[]
  recentNews: {
    id: string
    title: string
    status: string
    createdAt: string
    author?: { name?: string } | null
    category?: { name?: string; color?: string } | null
  }[]
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const h = 32
  const w = 80
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-20" fill="none">
      <path
        className="admin-sparkline"
        d={`M${points}`}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
      />
    </svg>
  )
}

function PercentageIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
        <ArrowUpRight className="size-3" />
        +{value}%
      </span>
    )
  }
  if (value < 0) {
    return (
      <span className="text-xs font-medium text-red-600 flex items-center gap-0.5">
        <ArrowDownRight className="size-3" />
        {value}%
      </span>
    )
  }
  return (
    <span className="text-xs font-medium text-gray-400 flex items-center gap-0.5">
      <Minus className="size-3" />
      0%
    </span>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg h-4 w-full ${className ?? ''}`} />
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Failed to load stats')
        const data = await res.json()
        setStats(data)
      } catch {
        setError('Ошибка загрузки статистики')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      label: 'Новости',
      value: stats?.totalNews ?? 0,
      change: 12,
      icon: Newspaper,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      text: 'text-blue-700',
      sparkColor: '#2563eb',
      sparkData: [3, 5, 4, 7, 6, 8, 10],
    },
    {
      label: 'Опубликовано',
      value: stats?.publishedNews ?? 0,
      change: 8,
      icon: CheckCircle,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
      text: 'text-green-700',
      sparkColor: '#16a34a',
      sparkData: [4, 3, 5, 6, 5, 7, 8],
    },
    {
      label: 'Черновики',
      value: stats?.draftNews ?? 0,
      change: -5,
      icon: FileEdit,
      bg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      text: 'text-yellow-700',
      sparkColor: '#ca8a04',
      sparkData: [5, 4, 6, 3, 4, 2, 3],
    },
    {
      label: 'Страницы',
      value: stats?.totalPages ?? 0,
      change: 0,
      icon: FileText,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      text: 'text-purple-700',
      sparkColor: '#9333ea',
      sparkData: [2, 2, 2, 3, 3, 3, 4],
    },
    {
      label: 'Комментарии',
      value: stats?.totalComments ?? 0,
      change: 15,
      icon: MessageSquare,
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      text: 'text-orange-700',
      sparkColor: '#ea580c',
      sparkData: [1, 3, 2, 5, 4, 6, 8],
    },
    {
      label: 'Медиафайлы',
      value: stats?.totalMedia ?? 0,
      change: 20,
      icon: ImageIcon,
      bg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      text: 'text-cyan-700',
      sparkColor: '#0891b2',
      sparkData: [2, 4, 3, 5, 7, 8, 10],
    },
  ]

  const actionLabels: Record<string, string> = {
    news_created: 'Новость создана',
    news_published: 'Новость опубликована',
    news_updated: 'Новость обновлена',
    news_deleted: 'Новость удалена',
    user_created: 'Пользователь создан',
    user_updated: 'Пользователь обновлён',
    comment_created: 'Комментарий создан',
    comment_approved: 'Комментарий одобрен',
    page_created: 'Страница создана',
    page_updated: 'Страница обновлена',
    media_uploaded: 'Медиа загружено',
    settings_updated: 'Настройки обновлены',
  }

  const entityIcons: Record<string, string> = {
    news: '📰',
    user: '👤',
    comment: '💬',
    page: '📄',
    media: '🖼️',
    settings: '⚙️',
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return 'только что'
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Б'
    const k = 1024
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm text-blue-600 hover:underline">
          Попробовать снова
        </button>
      </div>
    )
  }

  const newsByCategory = stats?.newsByCategory ?? []
  const maxCategoryCount = Math.max(...newsByCategory.map(c => c.count), 1)
  const recentActivity = stats?.recentActivity ?? []

  const commentStats = [
    { label: 'Одобрено', value: stats?.approvedComments ?? 0, color: 'bg-green-500' },
    { label: 'На модерации', value: stats?.pendingComments ?? 0, color: 'bg-yellow-500' },
    { label: 'Отклонено', value: (stats?.totalComments ?? 0) - (stats?.approvedComments ?? 0) - (stats?.pendingComments ?? 0), color: 'bg-red-500' },
  ]
  const totalForDonut = commentStats.reduce((a, b) => a + b.value, 0) || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-sm text-gray-500 mt-1">Обзор всей системы</p>
      </div>

      {/* Stats Row - 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="admin-stat-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg ${stat.bg} p-2.5`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                <Sparkline data={stat.sparkData} color={stat.sparkColor} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {stat.label === 'Медиафайлы' && stats?.mediaStorageUsed
                      ? formatBytes(stats.mediaStorageUsed)
                      : 'за неделю'}
                  </span>
                  <PercentageIndicator value={stat.change} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity + Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Последняя активность</h2>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[11px]">
              Последние события
            </Badge>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-base shrink-0">{entityIcons[item.entity] || '📋'}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {actionLabels[item.action] || item.action}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{item.details}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {item.user?.name && (
                          <>
                            <User className="size-3" />
                            <span>{item.user.name}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock className="size-3" />
                        <span>{formatTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400 text-sm">Активность пока не зафиксирована</p>
                <p className="text-gray-300 text-xs mt-1">Действия будут отображаться здесь</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Overview */}
        <div className="space-y-6">
          {/* News by Category */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Новости по категориям</h2>
            </div>
            <div className="p-4 space-y-3">
              {newsByCategory.length > 0 ? (
                newsByCategory.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="text-gray-500">{cat.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(cat.count / maxCategoryCount) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-4">Нет данных</p>
              )}
            </div>
          </div>

          {/* Comments by Status - Donut visual */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Комментарии по статусу</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {commentStats.reduce<{ offset: number; elements: React.ReactNode[] }>(
                      (acc, item, idx) => {
                        const pct = (item.value / totalForDonut) * 100
                        const colors = ['#22c55e', '#eab308', '#ef4444']
                        acc.elements.push(
                          <circle
                            key={idx}
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="none"
                            stroke={colors[idx]}
                            strokeWidth="3.5"
                            strokeDasharray={`${pct} ${100 - pct}`}
                            strokeDashoffset={-acc.offset}
                            className="transition-all duration-500"
                          />
                        )
                        acc.offset += pct
                        return acc
                      },
                      { offset: 0, elements: [] }
                    ).elements}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{stats?.totalComments ?? 0}</span>
                    <span className="text-[11px] text-gray-400">всего</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {commentStats.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Быстрые действия</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Link href="/admin/news" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
            <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
              <Plus className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Добавить новость</p>
              <p className="text-xs text-gray-400">Новая статья</p>
            </div>
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-green-50 hover:border-green-200 transition-colors group">
            <div className="rounded-lg bg-green-100 p-2 group-hover:bg-green-200 transition-colors">
              <FileText className="size-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Добавить страницу</p>
              <p className="text-xs text-gray-400">Новая страница</p>
            </div>
          </Link>
          <Link href="/admin/media" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-purple-50 hover:border-purple-200 transition-colors group">
            <div className="rounded-lg bg-purple-100 p-2 group-hover:bg-purple-200 transition-colors">
              <Upload className="size-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Загрузить медиа</p>
              <p className="text-xs text-gray-400">Файлы и фото</p>
            </div>
          </Link>
          <Link href="/admin/comments" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-orange-50 hover:border-orange-200 transition-colors group">
            <div className="rounded-lg bg-orange-100 p-2 group-hover:bg-orange-200 transition-colors">
              <MessageCircle className="size-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Комментарии</p>
              <p className="text-xs text-gray-400">Модерация</p>
            </div>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-cyan-50 hover:border-cyan-200 transition-colors group">
            <div className="rounded-lg bg-cyan-100 p-2 group-hover:bg-cyan-200 transition-colors">
              <ExternalLink className="size-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Открыть сайт</p>
              <p className="text-xs text-gray-400">Новая вкладка</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
