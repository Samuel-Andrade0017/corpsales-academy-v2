import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { calcCompletionRate, getInitials } from '@/lib/utils'

export default async function GoalsPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser?.company) redirect('/api/seed-company')

  const company = dbUser.company

  const [sellers, totalCourses] = await Promise.all([
    db.user.findMany({
      where: { companyId: company.id, role: 'EMPLOYEE' },
      include: {
        enrollments: { where: { completedAt: { not: null } } },
        certifications: { where: { passed: true } },
      },
      orderBy: { name: 'asc' },
    }),
    db.course.count({ where: { companyId: company.id, isPublished: true } }),
  ])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Metas de vendas</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o progresso de cada vendedor nas trilhas de treinamento
        </p>
      </div>

      {sellers.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <p className="font-medium mb-1">Nenhum vendedor cadastrado</p>
          <p className="text-sm text-muted-foreground">
            Convide sua equipe em Vendedores para acompanhar as metas.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendedor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trilhas concluídas</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Certificações</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Progresso geral</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const progress = calcCompletionRate(seller.enrollments.length, totalCourses || 1)
                const isOnTrack = progress >= 50
                return (
                  <tr key={seller.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs font-medium text-[#0C447C] flex-shrink-0">
                          {getInitials(seller.name)}
                        </div>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <p className="text-xs text-muted-foreground">{seller.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{seller.enrollments.length}</span>
                      <span className="text-muted-foreground"> / {totalCourses}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{seller.certifications.length}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              background: progress >= 80 ? '#3B6D11' : progress >= 50 ? '#185FA5' : '#A32D2D',
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isOnTrack
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {isOnTrack ? 'No prazo' : 'Atrasado'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}