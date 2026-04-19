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
  { label: 'Visão geral',    icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Trilhas',         icon: BookOpen,         href: '/courses' },
  { label: 'Produtos',        icon: Package,          href: '/products' },
  { label: 'Metas de vendas', icon: TrendingUp,       href: '/goals' },
  { label: 'Vendedores',      icon: Users,            href: '/users' },
  { label: 'Relatórios',      icon: FileText,         href: '/reports' },
  { label: 'Configurações',   icon: Settings,         href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { organization } = useOrganization()

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border flex flex-col py-5 px-3 gap-1" style={{ background: '#0a0a0a' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <div style={{ width: 36, height: 36, background: '#E3001B', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>CS</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: '#fff' }}>CorpSales Academy</p>
          {organization && (
            <p className="text-xs truncate" style={{ color: '#888' }}>{organization.name}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {routes.map((route) => {
          const isActive = pathname === route.href ||
            (route.href !== '/dashboard' && pathname.startsWith(route.href))
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'text-white font-semibold'
                  : 'hover:text-white'
              )}
              style={{
                background: isActive ? 'rgba(227,0,27,0.15)' : 'transparent',
                color: isActive ? '#fff' : '#666',
                borderLeft: isActive ? '2px solid #E3001B' : '2px solid transparent',
              }}
            >
              <route.icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: isActive ? '#E3001B' : '#555' }}
              />
              {route.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, paddingLeft: 4 }}>
        <UserButton
          appearance={{
            elements: {
              rootBox: 'w-full',
              userButtonTrigger: 'w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors',
              userButtonAvatarBox: 'w-7 h-7',
              userButtonOuterIdentifier: 'text-white text-sm',
            },
          }}
          showName
        />
      </div>
    </aside>
  )
}