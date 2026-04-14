import { db } from '@/lib/db'
import { calcCompletionRate } from '@/lib/utils'

// ─── Product Bars ────────────────────────────────────────────────────────────
export async function ProductBars({ companyId }: { companyId: string }) {
  const productLines = await db.productLine.findMany({
    where: { companyId },
    include: {
      certifications: { where: { passed: true } },
      _count: { select: { certifications: true } },
    },
  })

  const totalSellers = await db.user.count({
    where: { companyId, role: 'EMPLOYEE' },
  })

  const bars = productLines.map((pl) => ({
    name: pl.name,
    pct: calcCompletionRate(
      pl.certifications.filter((c) => c.passed).length,
      totalSellers
    ),
  }))

  const getColor = (pct: number) => {
    if (pct >= 75) return '#3B6D11'
    if (pct >= 50) return '#185FA5'
    if (pct >= 30) return '#BA7517'
    return '#A32D2D'
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-medium text-muted-foreground mb-4">Domínio por linha de produto</p>
      <div className="space-y-3">
        {bars.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma linha de produto cadastrada.
          </p>
        )}
        {bars.map((bar) => (
          <div key={bar.name}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-foreground">{bar.name}</span>
              <span className="text-xs text-muted-foreground">{bar.pct}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${bar.pct}%`, background: getColor(bar.pct) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Seller Ranking ───────────────────────────────────────────────────────────
export async function SellerRanking({ companyId }: { companyId: string }) {
  const sellers = await db.user.findMany({
    where: { companyId, role: 'EMPLOYEE' },
    include: {
      certifications: true,
    },
    take: 8,
  })

  const productLineCount = await db.productLine.count({ where: { companyId } })

  const ranked = sellers
    .map((s) => ({
      name: s.name,
      pct: calcCompletionRate(
        s.certifications.filter((c) => c.passed).length,
        productLineCount
      ),
    }))
    .sort((a, b) => b.pct - a.pct)

  const getBadge = (pct: number) => {
    if (pct === 100) return { bg: '#EAF3DE', color: '#27500A', label: '100%' }
    if (pct >= 80) return { bg: '#EAF3DE', color: '#27500A', label: `${pct}%` }
    if (pct >= 60) return { bg: '#E6F1FB', color: '#0C447C', label: `${pct}%` }
    if (pct >= 30) return { bg: '#FAEEDA', color: '#633806', label: `${pct}%` }
    return { bg: '#FCEBEB', color: '#791F1F', label: `${pct}%` }
  }

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  const avatarColors = ['#E6F1FB', '#EAF3DE', '#EEEDFE', '#FAEEDA', '#FCEBEB']
  const textColors   = ['#0C447C', '#27500A', '#3C3489', '#633806', '#791F1F']

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-medium text-muted-foreground mb-4">Ranking de vendedores</p>
      <div className="space-y-3">
        {ranked.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum vendedor cadastrado.
          </p>
        )}
        {ranked.map((seller, i) => {
          const badge = getBadge(seller.pct)
          const idx = i % avatarColors.length
          return (
            <div key={seller.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                  style={{ background: avatarColors[idx], color: textColors[idx] }}
                >
                  {getInitials(seller.name)}
                </div>
                <span className="text-sm">{seller.name}</span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Alerts Table ─────────────────────────────────────────────────────────────
interface CertAlert {
  id: string
  user: { name: string }
  productLine: { name: string }
}

export function AlertsTable({ uncertified }: { uncertified: CertAlert[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground">Sem certificação obrigatória</p>
        {uncertified.length > 0 && (
          <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
            {uncertified.length} pendentes
          </span>
        )}
      </div>
      {uncertified.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Todos certificados! 🎉</p>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Vendedor</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Produto</th>
            </tr>
          </thead>
          <tbody>
            {uncertified.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="px-4 py-2.5">{c.user.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{c.productLine.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ─── Product Updates ──────────────────────────────────────────────────────────
interface Update {
  id: string
  title: string
  urgency: string
  productLine: { name: string }
}

export function ProductUpdates({ updates }: { updates: Update[] }) {
  const urgencyStyle: Record<string, { bg: string; color: string; label: string }> = {
    URGENTE:   { bg: '#FCEBEB', color: '#791F1F', label: 'Urgente' },
    SEMANA:    { bg: '#FAEEDA', color: '#633806', label: 'Esta semana' },
    EM_BREVE:  { bg: '#EEEDFE', color: '#3C3489', label: 'Em breve' },
    NORMAL:    { bg: '#F1EFE8', color: '#444441', label: 'Normal' },
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-medium text-muted-foreground mb-4">Novidades de produto</p>
      {updates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atualização.</p>
      ) : (
        <div className="space-y-3">
          {updates.map((u) => {
            const style = urgencyStyle[u.urgency] ?? urgencyStyle.NORMAL
            return (
              <div key={u.id} className="flex items-start gap-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5"
                  style={{ background: style.bg, color: style.color }}
                >
                  {style.label}
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground">{u.title}</p>
                  <p className="text-xs text-muted-foreground">{u.productLine.name}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
