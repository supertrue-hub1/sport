'use client'

import {
  Newspaper,
  CheckCircle,
  Tags,
  Users,
  Plus,
  FileText,
  UserCog,
  ArrowUpRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/* ── stat cards data ── */
const stats = [
  {
    label: 'Всего новостей',
    value: '128',
    change: '+12% от прошлого месяца',
    icon: Newspaper,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    text: 'text-blue-700',
  },
  {
    label: 'Опубликовано',
    value: '96',
    change: '+8% от прошлого месяца',
    icon: CheckCircle,
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    text: 'text-green-700',
  },
  {
    label: 'Категории',
    value: '8',
    change: '+2 новые',
    icon: Tags,
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    text: 'text-purple-700',
  },
  {
    label: 'Пользователи',
    value: '24',
    change: '+12% от прошлого месяца',
    icon: Users,
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    text: 'text-orange-700',
  },
]

/* ── decorative sparkline SVG ── */
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

/* ── recent news data ── */
const recentNews = [
  {
    title: 'Патрик Махо́мс обновил рекорд передач в сезоне',
    category: 'NFL',
    categoryColor: 'bg-red-100 text-red-700',
    date: '15 янв 2025',
    status: 'Опубликовано',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    title: 'Леброн Джеймс побил рекорд Карима Абдул-Джаббара',
    category: 'NBA',
    categoryColor: 'bg-orange-100 text-orange-700',
    date: '14 янв 2025',
    status: 'Опубликовано',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    title: 'Шо́хей Отани стал MVP обеих лиг MLB',
    category: 'MLB',
    categoryColor: 'bg-sky-100 text-sky-700',
    date: '13 янв 2025',
    status: 'Черновик',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    title: 'Коннор Макдэвид признан лучшим игроком NHL',
    category: 'NHL',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    date: '12 янв 2025',
    status: 'Опубликовано',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    title: 'Драфт 2025: топ-прогнозы и главные перспективы',
    category: 'NFL',
    categoryColor: 'bg-red-100 text-red-700',
    date: '11 янв 2025',
    status: 'Опубликовано',
    statusColor: 'bg-green-100 text-green-700',
  },
]

/* ── weekly activity data ── */
const weeklyData = [
  { day: 'Пн', value: 65 },
  { day: 'Вт', value: 45 },
  { day: 'Ср', value: 80 },
  { day: 'Чт', value: 55 },
  { day: 'Пт', value: 90 },
  { day: 'Сб', value: 40 },
  { day: 'Вс', value: 70 },
]

export default function AdminDashboard() {
  const maxValue = Math.max(...weeklyData.map((d) => d.value))

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-sm text-gray-500 mt-1">Обзор всей системы</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="admin-stat-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-lg ${stat.bg} p-2.5`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                <Sparkline
                  color={
                    stat.iconColor === 'text-blue-600'
                      ? '#2563eb'
                      : stat.iconColor === 'text-green-600'
                        ? '#16a34a'
                        : stat.iconColor === 'text-purple-600'
                          ? '#9333ea'
                          : '#ea580c'
                  }
                />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.text}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-green-500" />
                  {stat.change}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two-column: Recent News + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Последние новости</h2>
            <a href="/admin/news" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Все новости
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNews.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={`${item.categoryColor} text-[11px] px-2 py-0`}>
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={`${item.statusColor} text-[11px] px-2 py-0 shrink-0`}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Быстрые действия</h2>
          </div>
          <div className="p-4 space-y-3">
            <a
              href="/admin/news"
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                <Plus className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Добавить новость</p>
                <p className="text-xs text-gray-400">Создать новую статью</p>
              </div>
            </a>
            <a
              href="/admin/categories"
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-green-50 hover:border-green-200 transition-colors group"
            >
              <div className="rounded-lg bg-green-100 p-2 group-hover:bg-green-200 transition-colors">
                <Tags className="size-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Создать категорию</p>
                <p className="text-xs text-gray-400">Добавить новую категорию</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 hover:bg-purple-50 hover:border-purple-200 transition-colors group"
            >
              <div className="rounded-lg bg-purple-100 p-2 group-hover:bg-purple-200 transition-colors">
                <UserCog className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Управление пользователями</p>
                <p className="text-xs text-gray-400">Просмотр и редактирование</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
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
