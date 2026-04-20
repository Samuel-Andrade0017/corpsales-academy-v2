import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const course = await db.course.findUnique({
    where: { id: params.courseId, companyId: dbUser.company.id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          quiz: {
            include: { questions: true },
          },
        },
      },
    },
  })

  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

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

  // Busca tentativas de quiz do usuário
  const quizAttempts = await db.quizAttempt.findMany({
    where: {
      userId: dbUser.id,
      moduleId: { in: course.modules.map(m => m.id) },
    },
  })

  return NextResponse.json({ course, enrollment, quizAttempts })
}