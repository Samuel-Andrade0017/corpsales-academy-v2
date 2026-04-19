import { Users, BookOpen, TrendingUp, AlertCircle } from 'lucide-react'

interface Props {
  totalSellers: number
  activeCourses: number
  completionRate: number
  uncertifiedCount: number
}

export function StatsCards({ totalSellers, activeCourses, completionRate, uncertifiedCount }: Props) {
  const cards = [
    {
      label: 'Vendedores ativos',
      value: totalSellers,
      icon: Users,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      suffix: '',
    },
    {
      label: 'Trilhas publicadas',
      value: activeCourses,
      icon: BookOpen,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)',
      suffix: '',
    },
    {
      label: 'Taxa de conclusão',
      value: completionRate,
      icon: TrendingUp,
      color: completionRate >= 70 ? '#22c55e' : completionRate >= 40 ? '#f59e0b' : '#ef4444',
      bg: completionRate >= 70 ? 'rgba(34,197,94,0.1)' : completionRate >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
      suffix: '%',
    },
    {
      label: 'Sem certificação',
      value: uncertifiedCount,
      icon: AlertCircle,
      color: uncertifiedCount === 0 ? '#22c55e' : '#ef4444',
      bg: uncertifiedCount === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
      suffix: '',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide leading-tight">{card.label}</p>
            <div style={{ background: card.bg, borderRadius: 8, padding: 6, flexShrink: 0 }}>
              <card.icon style={{ width: 14, height: 14, color: card.color }} />
            </div>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, color: card.color, lineHeight: 1, letterSpacing: '-1px' }}>
            {card.value}{card.suffix}
          </p>
        </div>
      ))}
    </div>
  )
}