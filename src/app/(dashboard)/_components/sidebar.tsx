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
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-border flex-col py-5 px-3 gap-1" style={{ background: '#0a0a0a' }}>
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

        <nav className="flex-1 flex flex-col gap-1">
          {routes.map((route) => {
            const isActive = pathname === route.href ||
              (route.href !== '/dashboard' && pathname.startsWith(route.href))
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all')}
                style={{
                  background: isActive ? 'rgba(227,0,27,0.15)' : 'transparent',
                  color: isActive ? '#fff' : '#666',
                  borderLeft: isActive ? '2px solid #E3001B' : '2px solid transparent',
                }}
              >
                <route.icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#E3001B' : '#555' } as any} />
                {route.label}
              </Link>
            )
          })}
        </nav>

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

      {/* BOTTOM NAV MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border flex items-center justify-around px-2 py-2" style={{ background: '#0a0a0a' }}>
        {routes.slice(0, 5).map((route) => {
          const isActive = pathname === route.href ||
            (route.href !== '/dashboard' && pathname.startsWith(route.href))
          return (
            <Link
              key={route.href}
              href={route.href}
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all"
              style={{ color: isActive ? '#E3001B' : '#555' }}
            >
              <route.icon className="w-5 h-5" />
              <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400 }}>{route.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}