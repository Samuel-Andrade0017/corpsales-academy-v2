import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Não autorizado', { status: 401 })

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      include: { company: true },
    })
    if (!dbUser?.company) return new NextResponse('Empresa não encontrada', { status: 404 })

    const { title, description, videoUrl } = await req.json()

    const lastModule = await db.module.findFirst({
      where: { courseId: params.courseId },
      orderBy: { order: 'desc' },
    })

    const module = await db.module.create({
      data: {
        title,
        description,
        videoUrl,
        courseId: params.courseId,
        order: (lastModule?.order ?? 0) + 1,
      },
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error('[MODULES_POST]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}