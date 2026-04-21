import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Plus, BookOpen, Users, Layers } from 'lucide-react'
import { DeleteCourseButton } from './_components/delete-course-button'

export default async function CoursesPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser?.company) redirect('/api/seed-company')
  const company = dbUser.company

  const courses = await db.course.findMany({
    where: { companyId: company.id },
    include: {
      productLine: true,
      _count: { select: { modules: true, enrollments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const published = courses.filter(c => c.isPublished).length
  const drafts = courses.filter(c => !c.isPublished).length

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Trilhas de treinamento</h1>
          <p className="text-sm text-muted-foreground mt-1">{courses.length} trilhas cadastradas</p>
        </div>
        <Link
          href="/courses/new"
          className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-3 md:px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Nova trilha</span>
          <span className="md:hidden">Nova</span>
        </Link>
      </div>

      {courses.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#E3001B]/10 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 text-[#E3001B]" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl font-bold">{courses.length}</p>
              <p className="text-xs text-muted-foreground leading-tight">total de trilhas</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl font-bold">{published}</p>
              <p className="text-xs text-muted-foreground leading-tight">publicadas</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl font-bold">{drafts}</p>
              <p className="text-xs text-muted-foreground leading-tight">rascunhos</p>
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E3001B]/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#E3001B]" />
          </div>
          <h3 className="font-semibold mb-2">Nenhuma trilha criada ainda</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Crie sua primeira trilha e comece a capacitar sua equipe.
          </p>
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-[#E3001B] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Criar primeira trilha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} style={{ position: 'relative', borderRadius: '1rem' }}>
              <Link
                href={`/courses/${course.id}`}
                className="block bg-card border border-border rounded-2xl p-4 md:p-5 hover:border-[#E3001B]/30 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#E3001B]/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-[#E3001B]" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    course.isPublished
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-secondary text-muted-foreground border border-border'
                  }`}>
                    {course.isPublished ? '● Publicada' : '○ Rascunho'}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.productLine && (
                    <p className="text-xs text-muted-foreground mb-3 bg-secondary px-2 py-0.5 rounded-md inline-block">
                      {course.productLine.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-border pb-8">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{course._count.modules} módulos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course._count.enrollments} matriculados</span>
                  </div>
                </div>
              </Link>

              <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}