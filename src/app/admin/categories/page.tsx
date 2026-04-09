'use client'

import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── mock categories data ── */
const categories = [
  { id: 1, name: 'NFL', color: '#ef4444', description: 'Национальная футбольная лига', newsCount: 42 },
  { id: 2, name: 'NBA', color: '#f97316', description: 'Национальная баскетбольная ассоциация', newsCount: 38 },
  { id: 3, name: 'MLB', color: '#0ea5e9', description: 'Главная бейсбольная лига', newsCount: 24 },
  { id: 4, name: 'NHL', color: '#06b6d4', description: 'Национальная хоккейная лига', newsCount: 18 },
  { id: 5, name: 'Трансферы', color: '#8b5cf6', description: 'Новости о переходах игроков', newsCount: 12 },
  { id: 6, name: 'Аналитика', color: '#10b981', description: 'Глубокий анализ и статистика', newsCount: 15 },
  { id: 7, name: 'Интервью', color: '#f59e0b', description: 'Эксклюзивные интервью', newsCount: 8 },
  { id: 8, name: 'Фэнтези', color: '#ec4899', description: 'Фэнтези-спорт и советы', newsCount: 6 },
]

export default function AdminCategories() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление категориями</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} категорий</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Plus className="size-4" />
          Добавить категорию
        </Button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="admin-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="size-4 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Pencil className="size-4" />
                </button>
                <button className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: cat.color,
                    width: `${Math.min(100, (cat.newsCount / 42) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500 shrink-0">
                {cat.newsCount} {cat.newsCount === 1 ? 'статья' : cat.newsCount < 5 ? 'статьи' : 'статей'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
