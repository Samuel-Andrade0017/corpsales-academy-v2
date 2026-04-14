interface Update {
  id: string
  title: string
  urgency: string
  productLine: { name: string }
}

const urgencyStyle: Record<string, { bg: string; color: string; label: string }> = {
  URGENTE:  { bg: '#FCEBEB', color: '#791F1F', label: 'Urgente' },
  SEMANA:   { bg: '#FAEEDA', color: '#633806', label: 'Esta semana' },
  EM_BREVE: { bg: '#EEEDFE', color: '#3C3489', label: 'Em breve' },
  NORMAL:   { bg: '#F1EFE8', color: '#444441', label: 'Normal' },
}

export function ProductUpdates({ updates }: { updates: Update[] }) {
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
                  <p className="text-xs font-medium">{u.title}</p>
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
