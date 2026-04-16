import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Não autorizado', { status: 401 })

    await db.module.delete({ where: { id: params.moduleId } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[MODULE_DELETE]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}