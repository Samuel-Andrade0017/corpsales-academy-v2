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
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
    </div>
  )
}