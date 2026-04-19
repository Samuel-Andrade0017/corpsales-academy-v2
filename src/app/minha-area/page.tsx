import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getInitials, calcCompletionRate } from '@/lib/utils'
import Link from 'next/link'
import { BookOpen, Trophy, CheckCircle, Clock } from 'lucide-react'

export default async function MinhaAreaPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      company: true,
      enrollments: {
        include: {
          course: {
            include: {
              modules: { include: { quiz: { include: { questions: true } } } },
            },
          },
        },
      },
      certifications: { where: { passed: true } },
    },
  })

  if (!dbUser) redirect('/api/seed-company')
  if (dbUser.role !== 'EMPLOYEE') redirect('/dashboard')

  const company = dbUser.company

  // Busca todos os cursos publicados da empresa
  const courses = await db.course.findMany({
    where: { companyId: company.id, isPublished: true },
    include: {
      modules: true,
      enrollments: { where: { userId: dbUser.id } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Ranking de vendedores
  const allUsers = await db.user.findMany({
    where: { companyId: company.id, role: 'EMPLOYEE' },
    include: {
      enrollments: { where: { completedAt: { not: null } } },
      certifications: { where: { passed: true } },
    },
    orderBy: { name: 'asc' },
  })

  const totalCourses = courses.length

  const ranking = allUsers
    .map(u => ({
      id: u.id,
      name: u.name,
      completed: u.enrollments.length,
      certs: u.certifications.length,
      pct: calcCompletionRate(u.enrollments.length, totalCourses || 1),
    }))
    .sort((a, b) => b.pct - a.pct)

  const myRank = ranking.findIndex(r => r.id === dbUser.id) + 1
  const myProgress = calcCompletionRate(
    dbUser.enrollments.filter(e => e.completedAt).length,
    totalCourses || 1
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3001B]/10 flex items-center justify-center text-sm font-bold text-[#E3001B]">
              {getInitials(dbUser.name)}
            </div>
            <div>
              <p className="font-semibold text-sm">{dbUser.name}</p>
              <p className="text-xs text-muted-foreground">{company.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">seu progresso geral</p>
            <p className="text-lg font-bold text-[#E3001B]">{myProgress}%</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-[#E3001B]/10 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-[#E3001B]" />
            </div>
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">trilhas disponíveis</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{dbUser.enrollments.filter(e => e.completedAt).length}</p>
            <p className="text-xs text-muted-foreground mt-1">trilhas concluídas</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold">#{myRank}</p>
            <p className="text-xs text-muted-foreground mt-1">no ranking</p>
          </div>
        </div>

        {/* Trilhas */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Suas trilhas</h2>
          {courses.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-12 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">Nenhuma trilha disponível ainda</p>
              <p className="text-sm text-muted-foreground">Seu gestor ainda não publicou nenhuma trilha.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const enrolled = course.enrollments.length > 0
                const completed = course.enrollments[0]?.completedAt
                const progress = enrolled ? calcCompletionRate(
                  course.enrollments[0]?.progress || 0,
                  course.modules.length || 1
                ) : 0

                return (
                  <div key={course.id} className="bg-card border border-border rounded-xl p-5 hover:border-[#E3001B]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E3001B]/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#E3001B]" />
                      </div>
                      {completed ? (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-medium">
                          ✓ Concluída
                        </span>
                      ) : enrolled ? (
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full font-medium">
                          Em andamento
                        </span>
                      ) : (
                        <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full font-medium">
                          Não iniciada
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{course.modules.length} módulos</p>

                    {enrolled && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progresso</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#E3001B]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/minha-area/curso/${course.id}`}
                      className="block w-full text-center text-sm font-medium py-2 rounded-lg transition-colors bg-[#E3001B] text-white hover:bg-red-700"
                    >
                      {completed ? 'Revisar trilha' : enrolled ? 'Continuar' : 'Começar trilha'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ranking */}
        <div>
          <h2 className="text-lg font-semibold mb-4">🏆 Ranking da equipe</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {ranking.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 ${r.id === dbUser.id ? 'bg-[#E3001B]/5' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900' :
                  i === 1 ? 'bg-gray-300 text-gray-700' :
                  i === 2 ? 'bg-orange-400 text-orange-900' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E3001B]/10 flex items-center justify-center text-xs font-bold text-[#E3001B] flex-shrink-0">
                  {getInitials(r.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${r.id === dbUser.id ? 'text-[#E3001B]' : ''}`}>
                    {r.name} {r.id === dbUser.id && '(você)'}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.completed} trilhas concluídas</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-[#E3001B] rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-8 text-right">{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}