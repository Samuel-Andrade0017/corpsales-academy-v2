import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Plus } from 'lucide-react'

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string }
}) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })
  if (!dbUser?.company) redirect('/api/seed-company')

  const course = await db.course.findUnique({
    where: { id: params.courseId, companyId: dbUser.company.id },
    include: {
      productLine: true,
      modules: { orderBy: { order: 'asc' }, include: { quiz: { include: { questions: true } } } },
      _count: { select: { enrollments: true } },
    },
  })
  if (!course) notFound()

  return (
    <div className="p-6 max-w-3xl">
      <Link href="/courses" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para trilhas
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold">{course.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.isPublished ? 'bg-green-50 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
              {course.isPublished ? 'Publicada' : 'Rascunho'}
            </span>
          </div>
          {course.description && (
            <p className="text-sm text-muted-foreground">{course.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <span>{course.modules.length} módulos</span>
            <span>·</span>
            <span>{course._count.enrollments} matriculados</span>
            {course.productLine && (
              <>
                <span>·</span>
                <span>{course.productLine.name}</span>
              </>
            )}
          </div>
        </div>
        <Link href={`/courses/${course.id}/edit`} className="flex items-center gap-2 border border-border text-sm px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">
          <Edit className="w-3.5 h-3.5" />
          Editar
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-sm">Módulos</h2>
          <Link href={`/courses/${course.id}/edit`} className="flex items-center gap-1.5 text-xs text-[#E3001B] hover:text-red-700 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Adicionar módulo
          </Link>
        </div>

        {course.modules.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Nenhum módulo ainda.</p>
            <Link href={`/courses/${course.id}/edit`} className="text-sm text-[#E3001B] hover:text-red-700 transition-colors">
              Adicionar primeiro módulo →
            </Link>
          </div>
        ) : (
          course.modules.map((mod, i) => (
            <div key={mod.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{mod.title}</p>
                {mod.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {mod.videoUrl && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Vídeo</span>}
                  {mod.quiz && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{mod.quiz.questions.length} perguntas</span>}
                  {!mod.isPublished && <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Rascunho</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}