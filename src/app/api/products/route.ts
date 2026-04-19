import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser?.company) return NextResponse.json([], { status: 200 })

  const products = await db.productLine.findMany({
    where: { companyId: dbUser.company.id },
    include: { courses: true },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser?.company) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

  const { name, description, category } = await req.json()

  const product = await db.productLine.create({
    data: {
      name,
      description,
      category,
      companyId: dbUser.company.id,
    },
    include: { courses: true },
  })

  return NextResponse.json(product)
}