'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Save, CheckCircle2, Loader2, AlertTriangle, RotateCcw } from 'lucide-react'

interface SettingsFlat {
  [key: string]: string
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg h-10 w-full ${className ?? ''}`} />
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsFlat>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      setSettings(data.flat ?? {})
    } catch {
      console.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSection = async (keys: string[], sectionName: string) => {
    setSaving(sectionName)
    setSaved(null)
    try {
      const sectionSettings: Record<string, string> = {}
      keys.forEach((k) => {
        sectionSettings[k] = settings[k] ?? ''
      })
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: sectionSettings }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(sectionName)
      setTimeout(() => setSaved(null), 3000)
    } catch {
      console.error('Failed to save settings')
    } finally {
      setSaving(null)
    }
  }

  const v = (key: string, fallback: string) => settings[key] ?? fallback

  // Danger Zone state
  const [dangerDialogOpen, setDangerDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [dangerLoading, setDangerLoading] = useState(false)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-sm text-gray-500 mt-1">Управление параметрами сайта</p>
      </div>

      {/* 1. Основные настройки */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Основные настройки</h2>
          <p className="text-sm text-gray-400 mt-0.5">Основная информация о сайте</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name" className="text-gray-700">Название сайта</Label>
            <Input
              id="site-name"
              value={v('site_name', 'US Sports Hub')}
              onChange={(e) => updateSetting('site_name', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description" className="text-gray-700">Описание сайта</Label>
            <Textarea
              id="site-description"
              value={v('site_description', '')}
              onChange={(e) => updateSetting('site_description', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white min-h-20"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-url" className="text-gray-700">URL сайта</Label>
            <Input
              id="site-url"
              value={v('site_url', '')}
              onChange={(e) => updateSetting('site_url', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-url" className="text-gray-700">Логотип URL</Label>
            <Input
              id="logo-url"
              value={v('logo_url', '')}
              onChange={(e) => updateSetting('logo_url', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => saveSection(['site_name', 'site_description', 'site_url', 'logo_url'], 'general')}
              disabled={saving === 'general'}
            >
              {saving === 'general' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : saved === 'general' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saved === 'general' ? 'Сохранено' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. SEO */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">SEO</h2>
          <p className="text-sm text-gray-400 mt-0.5">Настройки поисковой оптимизации</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title" className="text-gray-700">Meta title по умолчанию</Label>
            <Input
              id="seo-title"
              value={v('seo_title', '')}
              onChange={(e) => updateSetting('seo_title', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-desc" className="text-gray-700">Meta description по умолчанию</Label>
            <Textarea
              id="seo-desc"
              value={v('seo_desc', '')}
              onChange={(e) => updateSetting('seo_desc', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white min-h-20"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-keywords" className="text-gray-700">Meta keywords по умолчанию</Label>
            <Input
              id="seo-keywords"
              value={v('seo_keywords', '')}
              onChange={(e) => updateSetting('seo_keywords', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
              placeholder="спорт, NFL, NBA, MLB, NHL"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Robots meta</Label>
            <Select value={v('robots_meta', 'index')} onValueChange={(val) => updateSetting('robots_meta', val)}>
              <SelectTrigger className="w-full border-gray-200 bg-gray-50">
                <SelectValue placeholder="Выберите значение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index">index, follow</SelectItem>
                <SelectItem value="noindex">noindex, nofollow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => saveSection(['seo_title', 'seo_desc', 'seo_keywords', 'robots_meta'], 'seo')}
              disabled={saving === 'seo'}
            >
              {saving === 'seo' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : saved === 'seo' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saved === 'seo' ? 'Сохранено' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Внешний вид */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Внешний вид</h2>
          <p className="text-sm text-gray-400 mt-0.5">Настройки отображения</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-gray-700">Тема по умолчанию</Label>
            <Select value={v('default_theme', 'dark')} onValueChange={(val) => updateSetting('default_theme', val)}>
              <SelectTrigger className="w-full border-gray-200 bg-gray-50">
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Тёмная</SelectItem>
                <SelectItem value="light">Светлая</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="news-per-page" className="text-gray-700">Количество новостей на странице</Label>
            <Input
              id="news-per-page"
              type="number"
              min={1}
              max={50}
              value={v('news_per_page', '12')}
              onChange={(e) => updateSetting('news_per_page', e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white w-32"
            />
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Показывать Breaking News</p>
              <p className="text-xs text-gray-400 mt-0.5">Бегущая строка с экстренными новостями</p>
            </div>
            <Switch
              checked={v('show_breaking_news', 'true') === 'true'}
              onCheckedChange={(checked) => updateSetting('show_breaking_news', checked ? 'true' : 'false')}
            />
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Показывать Live Ticker</p>
              <p className="text-xs text-gray-400 mt-0.5">Живой тикер с результатами матчей</p>
            </div>
            <Switch
              checked={v('show_live_ticker', 'true') === 'true'}
              onCheckedChange={(checked) => updateSetting('show_live_ticker', checked ? 'true' : 'false')}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => saveSection(['default_theme', 'news_per_page', 'show_breaking_news', 'show_live_ticker'], 'appearance')}
              disabled={saving === 'appearance'}
            >
              {saving === 'appearance' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : saved === 'appearance' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saved === 'appearance' ? 'Сохранено' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Уведомления */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Уведомления</h2>
          <p className="text-sm text-gray-400 mt-0.5">Настройки получения уведомлений</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email уведомления о комментариях</p>
              <p className="text-xs text-gray-400 mt-0.5">Получать уведомления о новых комментариях</p>
            </div>
            <Switch
              checked={v('notify_comments', 'true') === 'true'}
              onCheckedChange={(checked) => updateSetting('notify_comments', checked ? 'true' : 'false')}
            />
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email уведомления о новых пользователях</p>
              <p className="text-xs text-gray-400 mt-0.5">Получать уведомления о регистрации</p>
            </div>
            <Switch
              checked={v('notify_users', 'false') === 'true'}
              onCheckedChange={(checked) => updateSetting('notify_users', checked ? 'true' : 'false')}
            />
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Отправлять еженедельный отчёт</p>
              <p className="text-xs text-gray-400 mt-0.5">Сводка событий за неделю на email</p>
            </div>
            <Switch
              checked={v('notify_weekly', 'false') === 'true'}
              onCheckedChange={(checked) => updateSetting('notify_weekly', checked ? 'true' : 'false')}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => saveSection(['notify_comments', 'notify_users', 'notify_weekly'], 'notifications')}
              disabled={saving === 'notifications'}
            >
              {saving === 'notifications' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : saved === 'notifications' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saved === 'notifications' ? 'Сохранено' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Опасная зона (Danger Zone) */}
      <div className="rounded-xl border-2 border-red-200 bg-white shadow-sm admin-danger-zone">
        <div className="admin-danger-header px-6 py-4 border-b border-red-100">
          <h2 className="text-base font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Опасная зона
          </h2>
          <p className="text-sm text-red-400 mt-0.5">Действия, которые нельзя отменить</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Очистить все данные</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Удалить все данные и заполнить базу тестовыми данными заново
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 shrink-0"
              onClick={() => setDangerDialogOpen(true)}
            >
              <AlertTriangle className="size-4 mr-1.5" />
              Очистить все данные
            </Button>
          </div>
          <div className="border-t border-red-50" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Сбросить базу данных</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Полностью очистить базу данных без заполнения тестовыми данными
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 shrink-0"
              onClick={() => setResetDialogOpen(true)}
            >
              <RotateCcw className="size-4 mr-1.5" />
              Сбросить базу данных
            </Button>
          </div>
        </div>
      </div>

      {/* Clear All Data Confirmation */}
      <AlertDialog open={dangerDialogOpen} onOpenChange={setDangerDialogOpen}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="size-5" />
              Очистить все данные?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Все данные будут удалены, а база данных будет заполнена тестовыми данными заново. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-200 text-gray-600">Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                setDangerLoading(true)
                try {
                  await fetch('/api/admin/seed', { method: 'POST' })
                } catch { /* ignore */ }
                setDangerLoading(false)
                setDangerDialogOpen(false)
              }}
              disabled={dangerLoading}
            >
              {dangerLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              Да, очистить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Database Confirmation */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="size-5" />
              Сбросить базу данных?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Все данные будут безвозвратно удалены. База данных будет полностью пустой. Убедитесь, что вы сделали резервную копию.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-gray-200 text-gray-600">Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                setDangerLoading(true)
                try {
                  await fetch('/api/admin/seed', { method: 'POST' })
                } catch { /* ignore */ }
                setDangerLoading(false)
                setResetDialogOpen(false)
              }}
              disabled={dangerLoading}
            >
              {dangerLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              Да, сбросить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
