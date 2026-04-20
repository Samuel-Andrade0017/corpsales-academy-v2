import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Não autorizado', { status: 401 })

    const { moduleId, questions } = await req.json()

    if (!moduleId || !questions?.length) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Deleta quiz existente se houver
    await db.quiz.deleteMany({ where: { moduleId } })

    // Cria novo quiz com perguntas
    const quiz = await db.quiz.create({
      data: {
        moduleId,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
          })),
        },
      },
      include: { questions: true },
    })

    return NextResponse.json({ questions: quiz.questions })
  } catch (error) {
    console.error('[QUIZ_MANUAL_POST]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}