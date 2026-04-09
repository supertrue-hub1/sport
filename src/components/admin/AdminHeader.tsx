'use client'

import { usePathname } from 'next/navigation'
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface AdminHeaderProps {
  onMenuToggle: () => void
}

const pageNames: Record<string, string> = {
  '/admin': 'Дашборд',
  '/admin/news': 'Новости',
  '/admin/categories': 'Категории',
  '/admin/users': 'Пользователи',
  '/admin/settings': 'Настройки',
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname()
  const currentPageName = pageNames[pathname] || 'Дашборд'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Открыть меню"
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-gray-500 hover:text-gray-700">
                Панель управления
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3.5 text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-medium">
                {currentPageName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск..."
              className="h-9 w-56 rounded-full border-gray-200 bg-gray-50 pl-9 text-sm focus-visible:bg-white focus-visible:border-blue-300"
            />
          </div>
        </div>

        {/* Mobile search */}
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 sm:hidden">
          <Search className="size-5" />
        </button>

        {/* Notification bell */}
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-gray-50 cursor-pointer">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-700 leading-tight">Администратор</p>
            <p className="text-xs text-gray-400">admin</p>
          </div>
          <Avatar className="size-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
              АД
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
