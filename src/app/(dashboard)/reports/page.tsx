import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { calcCompletionRate } from '@/lib/utils'

export default async function ReportsPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser?.company) redirect('/api/seed-company')

  const company = dbUser.company

  const [totalSellers, totalCourses, enrollments, certifications] = await Promise.all([
    db.user.count({ where: { companyId: company.id, role: 'EMPLOYEE' } }),
    db.course.count({ where: { companyId: company.id, isPublished: true } }),
    db.enrollment.findMany({
      where: { user: { companyId: company.id } },
    }),
    db.salesCertification.findMany({
      where: { user: { companyId: company.id }, passed: true },
    }),
  ])

  const completed = enrollments.filter((e) => e.completedAt).length
  const completionRate = calcCompletionRate(completed, enrollments.length)
  const certRate = calcCompletionRate(certifications.length, totalSellers || 1)

  const stats = [
    { label: 'Total de vendedores', value: totalSellers, icon: '👥' },
    { label: 'Trilhas publicadas', value: totalCourses, icon: '📚' },
    { label: 'Matrículas realizadas', value: enrollments.length, icon: '📝' },
    { label: 'Trilhas concluídas', value: completed, icon: '✅' },
    { label: 'Taxa de conclusão', value: `${completionRate}%`, icon: '📊' },
    { label: 'Taxa de certificação', value: `${certRate}%`, icon: '🏆' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Visão consolidada do desempenho da sua equipe
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className="text-2xl mb-3">{stat.icon}</div>
            <p className="text-2xl font-semibold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-medium mb-4">Resumo do período</h2>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-sm text-muted-foreground">
              Nenhum dado disponível ainda. Convide sua equipe e publique trilhas para ver os relatórios.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Progresso geral da equipe</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${completionRate}%`,
                      background: completionRate >= 80 ? '#3B6D11' : completionRate >= 50 ? '#185FA5' : '#A32D2D',
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Taxa de certificação</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${certRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{certRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Vendedores sem nenhuma trilha concluída</span>
              <span className="text-sm font-medium text-red-600">
                {totalSellers - completed > 0 ? totalSellers - completed : 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}