import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Plus } from 'lucide-react'

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Trilhas de treinamento</h1>
          <p className="text-sm text-muted-foreground">{courses.length} trilhas cadastradas</p>
        </div>
        <Link
          href="/courses/new"
          className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova trilha
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground mb-4">Nenhuma trilha criada ainda.</p>
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar primeira trilha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-card border border-border rounded-xl p-5 hover:border-border/80 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: '#FFF3F3' }}>
                  📚
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.isPublished ? 'bg-green-50 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
                  {course.isPublished ? 'Publicada' : 'Rascunho'}
                </span>
              </div>
              <h3 className="font-medium text-sm mb-1 group-hover:text-[#E3001B] transition-colors">
                {course.title}
              </h3>
              {course.productLine && (
                <p className="text-xs text-muted-foreground mb-3">{course.productLine.name}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{course._count.modules} módulos</span>
                <span>·</span>
                <span>{course._count.enrollments} matriculados</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}