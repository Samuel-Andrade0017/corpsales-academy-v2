import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId, orgId } = auth()
  if (!userId) return NextResponse.redirect(new URL('/sign-in', 'https://corpsales-academy.vercel.app'))
  if (!orgId) return NextResponse.redirect(new URL('/onboarding', 'https://corpsales-academy.vercel.app'))
  return NextResponse.redirect(new URL('/dashboard', 'https://corpsales-academy.vercel.app'))
}
