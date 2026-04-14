interface Props {
  totalSellers: number
  activeCourses: number
  completionRate: number
  uncertifiedCount: number
}

export function StatsCards({ totalSellers, activeCourses, completionRate, uncertifiedCount }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">vendedores ativos</p>
        <p className="text-2xl font-semibold">{totalSellers}</p>
      </div>
      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">trilhas publicadas</p>
        <p className="text-2xl font-semibold">{activeCourses}</p>
      </div>
      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">taxa de conclusão</p>
        <p className="text-2xl font-semibold text-green-700">{completionRate}%</p>
      </div>
      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">sem certificação</p>
        <p className="text-2xl font-semibold text-red-600">{uncertifiedCount}</p>
      </div>
    </div>
  )
}
