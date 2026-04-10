'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Pencil, Trash2, Loader2, Shield, User, Search, Mail, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface UserItem {
  id: string
  email: string
  name: string | null
  role: string
  avatar: string | null
  createdAt: string
  _count?: { news: number }
}

interface UserForm { email: string; name: string; role: string; password: string }

const emptyForm: UserForm = { email: '', name: '', role: 'editor', password: '' }

const roleMap: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: 'Админ', color: 'bg-red-100 text-red-700', icon: Shield },
  editor: { label: 'Редактор', color: 'bg-blue-100 text-blue-700', icon: Pencil },
  user: { label: 'Читатель', color: 'bg-gray-100 text-gray-600', icon: User },
}

function getInitials(name: string) {
  if (!name) return '??'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminUsers() {
  const { toast } = useToast()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Ошибка загрузки пользователей')
      const data = await res.json()
      setUsers(data)
    } catch {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить список пользователей',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { loadData() }, [loadData])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(
      (u) => (u.name || '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }, [users, search])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (item: UserItem) => {
    setEditingId(item.id)
    setForm({ email: item.email, name: item.name || '', role: item.role, password: '' })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.email.trim()) {
      toast({
        title: 'Ошибка валидации',
        description: 'Email обязателен',
        variant: 'destructive',
      })
      return
    }
    if (!form.name.trim()) {
      toast({
        title: 'Ошибка валидации',
        description: 'Имя обязательно',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, name: form.name.trim(), role: form.role }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Ошибка обновления пользователя')
        }
        toast({
          title: 'Пользователь обновлён',
          description: `"${form.name}" успешно сохранён`,
        })
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email.trim(),
            name: form.name.trim(),
            role: form.role,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Ошибка создания пользователя')
        }
        toast({
          title: 'Пользователь создан',
          description: `"${form.name}" добавлен в систему`,
        })
      }
      await loadData()
      setDialogOpen(false)
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

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Ошибка удаления пользователя')
      }
      toast({
        title: 'Пользователь удалён',
        description: `"${deleteTarget.name || deleteTarget.email}" удалён из системы`,
      })
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    } catch (err) {
      toast({
        title: 'Ошибка удаления',
        description: err instanceof Error ? err.message : 'Не удалось удалить пользователя',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const openDelete = (item: UserItem) => {
    setDeleteTarget(item)
  }

  // ─── Loading skeleton ───────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-64 rounded-md" />
        <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-0 divide-y divide-gray-50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center px-6 py-4 gap-4">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-44 ml-auto" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="size-8 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── Main content ───────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} из {users.length} пользователей
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={openCreate}>
          <Plus className="size-4" /> Добавить пользователя
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
              const role = roleMap[user.role] || roleMap.user
              const RoleIcon = role.icon
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className={`${role.color} text-xs font-semibold`}>
                          {getInitials(user.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{user.name || 'Без имени'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className={`${role.color} text-[11px] px-2 py-0 gap-1`}>
                      <RoleIcon className="size-3" />
                      {role.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(user)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Редактировать">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => openDelete(user)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="Удалить">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                  <User className="size-10 mx-auto mb-3 opacity-30" />
                  <p>{search ? 'Пользователи не найдены' : 'Пользователей пока нет'}</p>
                  <p className="text-xs mt-1">{search ? 'Попробуйте другой запрос' : 'Нажмите «Добавить пользователя» чтобы начать'}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((user) => {
          const role = roleMap[user.role] || roleMap.user
          const RoleIcon = role.icon
          return (
            <div key={user.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className={`${role.color} text-sm font-semibold`}>
                      {getInitials(user.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{user.name || 'Без имени'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className={`${role.color} text-[11px] px-2 py-0 gap-1`}>
                        <RoleIcon className="size-3" />
                        {role.label}
                      </Badge>
                      <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(user)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Pencil className="size-4" /></button>
                  <button onClick={() => openDelete(user)} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">
            <User className="size-10 mx-auto mb-3 opacity-30" />
            <p>{search ? 'Пользователи не найдены' : 'Пользователей пока нет'}</p>
          </div>
        )}
      </div>

      {/* ─── Create / Edit Dialog ───────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditingId(null) }}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Измените данные пользователя. Email изменить нельзя.' : 'Заполните данные нового пользователя'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">Имя *</Label>
              <Input
                id="user-name"
                placeholder="Иван Петров"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email *</Label>
              <div className="relative">
                <Input
                  id="user-email"
                  type="email"
                  placeholder="user@sportshub.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={!!editingId}
                  className={editingId ? 'bg-gray-50 text-gray-500 cursor-not-allowed pr-9' : 'pr-9'}
                />
                <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              </div>
              {editingId && (
                <p className="text-xs text-gray-400">Email нельзя изменить после создания</p>
              )}
            </div>
            {!editingId && (
              <div className="space-y-2">
                <Label htmlFor="user-password">Пароль</Label>
                <Input
                  id="user-password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <p className="text-xs text-gray-400">Пароль можно будет сменить позже</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Роль</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2"><Shield className="size-4 text-red-600" />Админ</div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2"><Pencil className="size-4 text-blue-600" />Редактор</div>
                  </SelectItem>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2"><User className="size-4 text-gray-600" />Читатель</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={!form.name.trim() || !form.email.trim() || saving}
            >
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editingId ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Удалить пользователя?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Пользователь «{deleteTarget?.name || deleteTarget?.email}» будет удалён навсегда.
              Это действие нельзя отменить. Убедитесь, что у пользователя нет авторских материалов.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {deleting && <Loader2 className="size-4 animate-spin mr-2" />}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
