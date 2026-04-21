import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
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

    const course = await db.course.findUnique({
      where: { id: params.courseId, companyId: dbUser.company.id },
      include: {
        productLine: true,
        modules: { orderBy: { order: 'asc' }, include: { quiz: true } },
        _count: { select: { enrollments: true } },
      },
    })
    if (!course) return new NextResponse('Não encontrado', { status: 404 })

    return NextResponse.json(course)
  } catch (error) {
    console.error('[COURSE_GET]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}

export async function PATCH(
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

    const body = await req.json()

    const course = await db.course.update({
      where: { id: params.courseId, companyId: dbUser.company.id },
      data: body,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('[COURSE_PATCH]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}
export async function DELETE(
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

    const course = await db.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course || course.companyId !== dbUser.company.id) {
      return new NextResponse('Não encontrado', { status: 404 })
    }

    await db.course.delete({
      where: { id: params.courseId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[COURSE_DELETE]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}