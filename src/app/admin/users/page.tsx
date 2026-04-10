'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Loader2, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/ui/select'

interface UserItem {
  id: string
  email: string
  name: string | null
  role: string
  avatar: string | null
  createdAt: string
}

interface UserForm { email: string; name: string; role: string }

const emptyForm: UserForm = { email: '', name: '', role: 'editor' }

const roleMap: Record<string, { label: string; color: string }> = {
  admin: { label: 'Админ', color: 'bg-red-100 text-red-700' },
  editor: { label: 'Редактор', color: 'bg-blue-100 text-blue-700' },
  user: { label: 'Читатель', color: 'bg-gray-100 text-gray-600' },
}

function getInitials(name: string) {
  if (!name) return '??'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) setUsers(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = users.filter(
    (u) => (u.name || '').toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (item: UserItem) => { setEditingId(item.id); setForm({ email: item.email, name: item.name || '', role: item.role }); setDialogOpen(true) }

  const handleSave = async () => {
    if (!form.email.trim() || !form.name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      } else {
        await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      }
      await loadData()
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить пользователя "${name}"?`)) return
    try {
      await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2"><div className="animate-pulse bg-gray-200 rounded-lg h-8 w-48" /><div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" /></div>
        <div className="space-y-2"><div className="animate-pulse bg-gray-200 rounded-lg h-9 w-64" /></div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-2 p-6">{[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} пользователей</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" /> Добавить пользователя
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Поиск по имени или email..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-9 border-gray-200 bg-gray-50 focus-visible:bg-white" />
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
              const role = roleMap[user.role] || roleMap.user
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className={`${role.color} text-xs font-semibold`}>{getInitials(user.name || '')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{user.name || 'Без имени'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3.5"><Badge variant="secondary" className={`${role.color} text-[11px] px-2 py-0`}>{role.label}</Badge></td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(user)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Редактировать"><Pencil className="size-4" /></button>
                      <button onClick={() => handleDelete(user.id, user.name || user.email)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Удалить"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Пользователи не найдены</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((user) => {
          const role = roleMap[user.role] || roleMap.user
          return (
            <div key={user.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className={`${role.color} text-sm font-semibold`}>{getInitials(user.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{user.name || 'Без имени'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className={`${role.color} text-[11px] px-2 py-0`}>{role.label}</Badge>
                      <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(user)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Pencil className="size-4" /></button>
                  <button onClick={() => handleDelete(user.id, user.name || user.email)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">Пользователи не найдены</div>}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditingId(null) }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">Имя *</Label>
              <Input id="user-name" placeholder="Иван Петров" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email *</Label>
              <Input id="user-email" type="email" placeholder="user@sportshub.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Роль</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="size-4 text-red-600" />Админ</div></SelectItem>
                  <SelectItem value="editor"><div className="flex items-center gap-2"><User className="size-4 text-blue-600" />Редактор</div></SelectItem>
                  <SelectItem value="user"><div className="flex items-center gap-2"><User className="size-4 text-gray-600" />Читатель</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={!form.name.trim() || !form.email.trim() || saving}>
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
