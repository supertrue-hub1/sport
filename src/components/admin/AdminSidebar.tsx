'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldCheck,
  LayoutDashboard,
  Newspaper,
  FileText,
  Image,
  Tags,
  FolderTree,
  MessageSquare,
  Users,
  Menu,
  Settings,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'КОНТЕНТ',
    items: [
      { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
      { href: '/admin/news', label: 'Новости', icon: Newspaper },
      { href: '/admin/pages', label: 'Страницы', icon: FileText },
      { href: '/admin/media', label: 'Медиатека', icon: Image },
      { href: '/admin/tags', label: 'Теги', icon: Tags },
    ],
  },
  {
    title: 'УПРАВЛЕНИЕ',
    items: [
      { href: '/admin/categories', label: 'Категории', icon: FolderTree },
      { href: '/admin/comments', label: 'Комментарии', icon: MessageSquare },
      { href: '/admin/users', label: 'Пользователи', icon: Users },
      { href: '/admin/menus', label: 'Меню', icon: Menu },
    ],
  },
  {
    title: 'СИСТЕМА',
    items: [
      { href: '/admin/settings', label: 'Настройки', icon: Settings },
    ],
  },
]

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="admin-overlay fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar admin-scroll fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-white border-r border-gray-200 lg:translate-x-0 lg:z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                US Sports Hub
              </h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Панель управления
              </p>
            </div>
          </div>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navSections.map((section, sectionIdx) => (
              <li key={section.title}>
                {/* Section header */}
                <div className={`px-3 pb-2 ${sectionIdx > 0 ? 'pt-5' : ''}`}>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {section.title}
                  </span>
                </div>
                {/* Section items */}
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-blue-50 text-blue-700 border-l-[3px] border-blue-600 pl-[9px]'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-[3px] border-transparent pl-[9px]'
                      }`}
                    >
                      <Icon className="size-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
                {/* Separator between sections */}
                {sectionIdx < navSections.length - 1 && (
                  <div className="my-3 mx-3 border-t border-gray-100" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User info card */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                АД
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                Администратор
              </p>
              <p className="text-xs text-gray-400 truncate">
                admin@sportshub.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
