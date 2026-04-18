import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId, content } = await req.json()

  if (!moduleId || !content) {
    return NextResponse.json({ error: 'moduleId e content são obrigatórios' }, { status: 400 })
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Com base no seguinte conteúdo de treinamento de vendas, gere 5 perguntas de múltipla escolha em português brasileiro. 
        
Conteúdo: ${content}

Responda APENAS com um JSON válido, sem texto adicional, no seguinte formato:
{
  "questions": [
    {
      "text": "Pergunta aqui?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctIndex": 0
    }
  ]
}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    // Salva no banco
    const quiz = await db.quiz.upsert({
      where: { moduleId },
      update: {},
      create: { moduleId },
    })

    // Remove perguntas antigas e cria novas
    await db.question.deleteMany({ where: { quizId: quiz.id } })
    await db.question.createMany({
      data: parsed.questions.map((q: { text: string; options: string[]; correctIndex: number }) => ({
        quizId: quiz.id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    })

    return NextResponse.json({ success: true, questions: parsed.questions })
  } catch {
    return NextResponse.json({ error: 'Erro ao processar resposta da IA' }, { status: 500 })
  }
}