import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId, courseId } = await req.json()

  const dbUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Busca ou cria enrollment
  let enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: dbUser.id, courseId } },
    include: { moduleProgress: true },
  })

  if (!enrollment) {
    enrollment = await db.enrollment.create({
      data: { userId: dbUser.id, courseId, progress: 0 },
      include: { moduleProgress: true },
    })
  }

  // Marca módulo como concluído
  await db.moduleProgress.upsert({
    where: { enrollmentId_moduleId: { enrollmentId: enrollment.id, moduleId } },
    create: { enrollmentId: enrollment.id, moduleId, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() },
  })

  // Atualiza progresso geral
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { modules: true },
  })

  const totalModules = course?.modules.length || 1
  const completedModules = await db.moduleProgress.count({
    where: { enrollmentId: enrollment.id, completed: true },
  })

  const progress = Math.round((completedModules / totalModules) * 100)
  const isCompleted = progress === 100

  await db.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: completedModules,
      completedAt: isCompleted ? new Date() : null,
    },
  })

  return NextResponse.json({ success: true, progress, isCompleted })
}