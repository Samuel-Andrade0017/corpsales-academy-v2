import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ArrowLeft, BookOpen, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function CursoPage({ params }: { params: { courseId: string } }) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser) redirect('/api/seed-company')
  if (dbUser.role !== 'EMPLOYEE') redirect('/dashboard')

  const course = await db.course.findUnique({
    where: { id: params.courseId, companyId: dbUser.company.id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { quiz: { include: { questions: true } } },
      },
    },
  })

  if (!course) redirect('/minha-area')

  // Matricula o vendedor automaticamente se ainda não estiver
  let enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: dbUser.id, courseId: course.id } },
    include: { moduleProgress: true },
  })

  if (!enrollment) {
    enrollment = await db.enrollment.create({
      data: { userId: dbUser.id, courseId: course.id, progress: 0 },
      include: { moduleProgress: true },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/minha-area" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold">{course.title}</h1>
            <p className="text-xs text-muted-foreground">{course.modules.length} módulos</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {course.description && (
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </div>
        )}

        <h2 className="font-semibold mb-4">Módulos da trilha</h2>

        <div className="space-y-3">
          {course.modules.map((mod, i) => {
            const modProgress = enrollment?.moduleProgress.find(mp => mp.moduleId === mod.id)
            const isCompleted = modProgress?.completed ?? false
            const isFirst = i === 0
            const prevCompleted = i === 0 || enrollment?.moduleProgress.find(
              mp => mp.moduleId === course.modules[i - 1].id
            )?.completed

            return (
              <div key={mod.id} className={`bg-card border rounded-xl p-5 transition-colors ${
                isCompleted ? 'border-green-200' : 'border-border'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-500/10' : 'bg-[#E3001B]/10'
                  }`}>
                    {isCompleted
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : <BookOpen className="w-5 h-5 text-[#E3001B]" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">Módulo {i + 1}</span>
                      {isCompleted && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                          Concluído
                        </span>
                      )}
                      {mod.quiz && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                          {mod.quiz.questions.length} perguntas
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{mod.title}</p>
                    {mod.description && (
                      <p className="text-sm text-muted-foreground mt-1">{mod.description}</p>
                    )}
                    {mod.videoUrl && (
                      <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-black">
                        <iframe
                          src={mod.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {course.modules.length === 0 && (
          <div className="border border-dashed border-border rounded-xl p-12 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum módulo disponível ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}