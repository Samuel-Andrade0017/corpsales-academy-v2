import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Não autorizado', { status: 401 })

    const dbUser = await db.user.findUnique({ where: { clerkId: userId } })
    if (!dbUser) return new NextResponse('Usuário não encontrado', { status: 404 })

    const { attempts } = await req.json()

    await db.quizAttempt.createMany({
      data: attempts.map((a: any) => ({
        userId: dbUser.id,
        questionId: a.questionId,
        moduleId: a.moduleId,
        correct: a.correct,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[QUIZ_ATTEMPT_POST]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}