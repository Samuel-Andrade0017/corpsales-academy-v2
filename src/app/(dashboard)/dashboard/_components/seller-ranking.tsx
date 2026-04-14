import { db } from '@/lib/db'
import { calcCompletionRate, getInitials } from '@/lib/utils'

export async function SellerRanking({ companyId }: { companyId: string }) {
  const [sellers, productLineCount] = await Promise.all([
    db.user.findMany({
      where: { companyId, role: 'EMPLOYEE' },
      include: { certifications: { where: { passed: true } } },
    }),
    db.productLine.count({ where: { companyId } }),
  ])

  const ranked = sellers
    .map((s) => ({
      name: s.name,
      pct: calcCompletionRate(s.certifications.length, productLineCount || 1),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8)

  const getBadge = (pct: number) => {
    if (pct >= 80) return { bg: '#EAF3DE', color: '#27500A' }
    if (pct >= 60) return { bg: '#E6F1FB', color: '#0C447C' }
    if (pct >= 30) return { bg: '#FAEEDA', color: '#633806' }
    return { bg: '#FCEBEB', color: '#791F1F' }
  }

  const avatarColors = ['#E6F1FB','#EAF3DE','#EEEDFE','#FAEEDA','#FCEBEB']
  const textColors   = ['#0C447C','#27500A','#3C3489','#633806','#791F1F']

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-medium text-muted-foreground mb-4">Ranking de vendedores</p>
      <div className="space-y-3">
        {ranked.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum vendedor cadastrado.</p>
        ) : ranked.map((seller, i) => {
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
                <span className="text-sm truncate max-w-[120px]">{seller.name}</span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                style={{ background: badge.bg, color: badge.color }}
              >
                {seller.pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
