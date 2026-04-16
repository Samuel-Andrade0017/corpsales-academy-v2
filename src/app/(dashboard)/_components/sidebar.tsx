'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useOrganization } from '@clerk/nextjs'
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Users,
  FileText,
  Package,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const routes = [
  { label: 'Visão geral',     icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Trilhas',          icon: BookOpen,         href: '/courses' },
  { label: 'Produtos',         icon: Package,          href: '/products' },
  { label: 'Metas de vendas',  icon: TrendingUp,       href: '/goals' },
  { label: 'Vendedores',       icon: Users,            href: '/users' },
  { label: 'Relatórios',       icon: FileText,         href: '/reports' },
  { label: 'Configurações',    icon: Settings,         href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { organization } = useOrganization()

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-card flex flex-col py-4 px-3 gap-1">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-4">
        <div className="w-7 h-7 bg-[#E3001B] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">CT</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">CorpSales Academy</p>
          {organization && (
            <p className="text-xs text-muted-foreground truncate">{organization.name}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {routes.map((route) => {
          const isActive = pathname === route.href ||
            (route.href !== '/dashboard' && pathname.startsWith(route.href))
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <route.icon className="w-4 h-4 flex-shrink-0" />
              {route.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border pt-3 px-1">
        <UserButton
          appearance={{
            elements: {
              rootBox: 'w-full',
              userButtonTrigger: 'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary/50 transition-colors',
              userButtonAvatarBox: 'w-7 h-7',
            },
          }}
          showName
        />
      </div>
    </aside>
  )
}
