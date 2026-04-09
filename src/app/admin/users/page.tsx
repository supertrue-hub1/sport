'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

/* ── mock users data ── */
const users = [
  { id: 1, name: 'Иван Петров', email: 'ivan@sportshub.com', role: 'admin', initials: 'ИП', date: '2024-03-15', avatarColor: 'bg-red-100 text-red-700' },
  { id: 2, name: 'Елена Сидорова', email: 'elena@sportshub.com', role: 'editor', initials: 'ЕС', date: '2024-05-22', avatarColor: 'bg-blue-100 text-blue-700' },
  { id: 3, name: 'Алексей Козлов', email: 'alexey@sportshub.com', role: 'editor', initials: 'АК', date: '2024-06-10', avatarColor: 'bg-green-100 text-green-700' },
  { id: 4, name: 'Мария Волкова', email: 'maria@sportshub.com', role: 'viewer', initials: 'МВ', date: '2024-08-01', avatarColor: 'bg-purple-100 text-purple-700' },
  { id: 5, name: 'Дмитрий Новиков', email: 'dmitry@sportshub.com', role: 'viewer', initials: 'ДН', date: '2024-09-18', avatarColor: 'bg-orange-100 text-orange-700' },
  { id: 6, name: 'Ольга Федорова', email: 'olga@sportshub.com', role: 'editor', initials: 'ОФ', date: '2024-11-05', avatarColor: 'bg-pink-100 text-pink-700' },
]

const roleMap: Record<string, { label: string; color: string }> = {
  admin: { label: 'Админ', color: 'bg-red-100 text-red-700' },
  editor: { label: 'Редактор', color: 'bg-blue-100 text-blue-700' },
  viewer: { label: 'Читатель', color: 'bg-gray-100 text-gray-600' },
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function UserCard({ user }: { user: (typeof users)[0] }) {
  const role = roleMap[user.role]
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className={`${user.avatarColor} text-sm font-semibold`}>
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className={`${role.color} text-[11px] px-2 py-0`}>
                {role.label}
              </Badge>
              <span className="text-xs text-gray-400">{formatDate(user.date)}</span>
            </div>
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

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} пользователей</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Plus className="size-4" />
          Добавить пользователя
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск по имени или email..."
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
              <th className="text-left px-6 py-3 font-medium text-gray-500">Пользователь</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Роль</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Дата регистрации</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user) => {
              const role = roleMap[user.role]
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className={`${user.avatarColor} text-xs font-semibold`}>
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${role.color} text-[11px] px-2 py-0`}>
                      {role.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(user.date)}</td>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Пользователи не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">
            Пользователи не найдены
          </div>
        )}
      </div>
    </div>
  )
}
