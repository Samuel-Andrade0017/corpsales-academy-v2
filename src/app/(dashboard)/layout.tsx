import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Sidebar } from './_components/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!dbUser) redirect('/api/seed-company')

  if (dbUser.role === 'EMPLOYEE') {
    redirect('/minha-area')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f0f0f' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ background: '#0f0f0f' }}>{children}</main>
    </div>
  )
}