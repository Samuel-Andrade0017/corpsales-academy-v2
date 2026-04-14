import { db } from '@/lib/db'
import { calcCompletionRate } from '@/lib/utils'

export async function ProductBars({ companyId }: { companyId: string }) {
  const [productLines, totalSellers] = await Promise.all([
    db.productLine.findMany({
      where: { companyId },
      include: { certifications: { where: { passed: true } } },
    }),
    db.user.count({ where: { companyId, role: 'EMPLOYEE' } }),
  ])

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
        {productLines.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma linha cadastrada.</p>
        ) : productLines.map((pl) => {
          const pct = calcCompletionRate(pl.certifications.length, totalSellers)
          return (
            <div key={pl.id}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-foreground">{pl.name}</span>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: getColor(pct) }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
