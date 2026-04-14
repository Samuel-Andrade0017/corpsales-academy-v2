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
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Produto pendente</th>
            </tr>
          </thead>
          <tbody>
            {uncertified.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-2.5 font-medium">{c.user.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{c.productLine.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
