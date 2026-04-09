'use client'

import { useState } from 'react'
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
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('US Sports Hub')
  const [siteDescription, setSiteDescription] = useState(
    'Премиальная спортивная медиаплатформа США — освещение NFL, NBA, MLB, NHL с глубокой аналитикой и интерактивной статистикой.'
  )
  const [siteUrl, setSiteUrl] = useState('https://ussportshub.com')
  const [theme, setTheme] = useState('dark')
  const [primaryColor, setPrimaryColor] = useState('#d4af37')

  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const [twoFA, setTwoFA] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <Label htmlFor="site-name" className="text-gray-700">
              Название сайта
            </Label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description" className="text-gray-700">
              Описание
            </Label>
            <Textarea
              id="site-description"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white min-h-20"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-url" className="text-gray-700">
              URL сайта
            </Label>
            <Input
              id="site-url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="size-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Внешний вид */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Внешний вид</h2>
          <p className="text-sm text-gray-400 mt-0.5">Настройки темы и цветов</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Тема</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full border-gray-200 bg-gray-50">
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Светлая</SelectItem>
                <SelectItem value="dark">Тёмная</SelectItem>
                <SelectItem value="system">Системная</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-color" className="text-gray-700">
              Основной цвет
            </Label>
            <div className="flex items-center gap-3">
              <input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="size-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 border-gray-200 bg-gray-50 focus-visible:bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="size-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Уведомления */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Уведомления</h2>
          <p className="text-sm text-gray-400 mt-0.5">Настройки получения уведомлений</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email уведомления</p>
              <p className="text-xs text-gray-400 mt-0.5">Получать уведомления на email</p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Push уведомления</p>
              <p className="text-xs text-gray-400 mt-0.5">Браузерные push-уведомления</p>
            </div>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>
          <div className="border-t border-gray-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Еженедельный дайджест</p>
              <p className="text-xs text-gray-400 mt-0.5">Сводка событий за неделю</p>
            </div>
            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
          <div className="flex justify-end pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="size-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Безопасность */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Безопасность</h2>
          <p className="text-sm text-gray-400 mt-0.5">Изменение пароля и двухфакторная аутентификация</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="old-password" className="text-gray-700">
              Текущий пароль
            </Label>
            <Input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Введите текущий пароль"
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-gray-700">
              Новый пароль
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-gray-700">
              Подтверждение пароля
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
              className="border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>
          <div className="border-t border-gray-50 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Двухфакторная аутентификация (2FA)</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Дополнительный уровень защиты аккаунта
                </p>
              </div>
              <Switch checked={twoFA} onCheckedChange={setTwoFA} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="size-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
