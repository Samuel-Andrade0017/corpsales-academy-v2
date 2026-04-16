import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createCourseSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Não autorizado', { status: 401 })

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      include: { company: true },
    })
    if (!dbUser?.company) return new NextResponse('Empresa não encontrada', { status: 404 })

    const body = await req.json()
    const { title, description } = createCourseSchema.parse(body)

    const course = await db.course.create({
      data: { title, description, companyId: dbUser.company.id },
    })

    return NextResponse.json(course)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('[COURSES_POST]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Não autorizado', { status: 401 })

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      include: { company: true },
    })
    if (!dbUser?.company) return new NextResponse('Empresa não encontrada', { status: 404 })

    const courses = await db.course.findMany({
      where: { companyId: dbUser.company.id },
      include: {
        productLine: true,
        _count: { select: { modules: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('[COURSES_GET]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}