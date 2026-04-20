import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const companyId = cookies().get('invite_company_id')?.value ?? null
  return NextResponse.json({ companyId })
}