'use client'

import { useState, useEffect } from 'react'
import {
  Newspaper, CheckCircle, Tags, Users, Plus, FileText, UserCog, ArrowUpRight, Loader2,
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
  recentNews: {
    id: string
    title: string
    status: string
    createdAt: string
    author?: { name?: string } | null
    category?: { name?: string; color?: string } | null
  }[]
}

function Sparkline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 32" className="h-8 w-20" fill="none">
      <path
        className="admin-sparkline"
        d="M0 28 L10 24 L20 18 L30 22 L40 12 L50 16 L60 6 L70 10 L80 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
      />
    </svg>
  )
}

const weeklyData = [
  { day: 'Пн', value: 65 },
  { day: 'Вт', value: 45 },
  { day: 'Ср', value: 80 },
  { day: 'Чт', value: 55 },
  { day: 'Пт', value: 90 },
  { day: 'Сб', value: 40 },
  { day: 'Вс', value: 70 },
]

function Skeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-full" />
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    { label: 'Всего новостей', value: stats?.totalNews ?? 0, change: 'Всего статей', icon: Newspaper, bg: 'bg-blue-50', iconColor: 'text-blue-600', text: 'text-blue-700', sparkColor: '#2563eb' },
    { label: 'Опубликовано', value: stats?.publishedNews ?? 0, change: 'Активных публикаций', icon: CheckCircle, bg: 'bg-green-50', iconColor: 'text-green-600', text: 'text-green-700', sparkColor: '#16a34a' },
    { label: 'Категории', value: stats?.totalCategories ?? 0, change: 'Всего категорий', icon: Tags, bg: 'bg-purple-50', iconColor: 'text-purple-600', text: 'text-purple-700', sparkColor: '#9333ea' },
    { label: 'Пользователи', value: stats?.totalUsers ?? 0, change: 'Зарегистрировано', icon: Users, bg: 'bg-orange-50', iconColor: 'text-orange-600', text: 'text-orange-700', sparkColor: '#ea580c' },
  ]

  const statusMap: Record<string, { label: string; color: string }> = {
    published: { label: 'Опубликовано', color: 'bg-green-100 text-green-700' },
    draft: { label: 'Черновик', color: 'bg-yellow-100 text-yellow-700' },
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })

  const maxValue = Math.max(...weeklyData.map((d) => d.value))

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-sm text-gray-500 mt-1">Обзор всей системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="admin-stat-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg ${stat.bg} p-2.5`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                <Sparkline color={stat.sparkColor} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-green-500" />
                  {stat.change}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Последние новости</h2>
            <Link href="/admin/news" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Все новости
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentNews && stats.recentNews.length > 0 ? (
              stats.recentNews.map((item) => {
                const st = statusMap[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-600' }
                const catColor = item.category?.color
                return (
                  <div key={item.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[11px] px-2 py-0"
                          style={{
                            backgroundColor: catColor ? `${catColor}18` : undefined,
                            color: catColor ? '#fff' : undefined,
                          }}
                        >
                          {item.category?.name || 'Без категории'}
                        </Badge>
                        <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${st.color} text-[11px] px-2 py-0 shrink-0`}>
                      {st.label}
                    </Badge>
                  </div>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">Новостей пока нет</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Быстрые действия</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link href="/admin/news" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
              <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                <Plus className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Добавить новость</p>
                <p className="text-xs text-gray-400">Создать новую статью</p>
              </div>
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-green-50 hover:border-green-200 transition-colors group">
              <div className="rounded-lg bg-green-100 p-2 group-hover:bg-green-200 transition-colors">
                <Tags className="size-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Создать категорию</p>
                <p className="text-xs text-gray-400">Добавить новую категорию</p>
              </div>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-purple-50 hover:border-purple-200 transition-colors group">
              <div className="rounded-lg bg-purple-100 p-2 group-hover:bg-purple-200 transition-colors">
                <UserCog className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Управление пользователями</p>
                <p className="text-xs text-gray-400">Просмотр и редактирование</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Активность за неделю</h2>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[11px]">
            Последние 7 дней
          </Badge>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyData.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs font-medium text-gray-500">{item.value}</span>
                <div className="w-full flex justify-center">
                  <div
                    className="admin-bar w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                    style={{ height: `${(item.value / maxValue) * 140}px` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
