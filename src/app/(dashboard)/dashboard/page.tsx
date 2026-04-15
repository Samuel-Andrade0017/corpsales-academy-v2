import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { calcCompletionRate } from '@/lib/utils'
import { StatsCards } from './_components/stats-cards'
import { ProductBars } from './_components/product-bars'
import { SellerRanking } from './_components/seller-ranking'
import { AlertsTable } from './_components/alerts-table'
import { ProductUpdates } from './_components/product-updates'

export default async function DashboardPage() {
  const { userId, orgId, orgSlug } = auth()
  if (!userId) redirect('/sign-in')
  if (!orgId) redirect('/onboarding')

  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  // Garante que a company existe
  const company = await db.company.upsert({
    where: { clerkOrgId: orgId },
    update: {},
    create: {
      clerkOrgId: orgId,
      name: orgSlug ?? 'Minha Empresa',
    },
  })

  // Garante que o user existe
  await db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'Usuário',
      companyId: company.id,
      role: 'ADMIN',
    },
  })

  const [totalSellers, activeCourses, enrollments, uncertified, productUpdates] =
    await Promise.all([
      db.user.count({ where: { companyId: company.id, role: 'EMPLOYEE' } }),
      db.course.count({ where: { companyId: company.id, isPublished: true } }),
      db.enrollment.findMany({
        where: { user: { companyId: company.id } },
        include: { user: true, course: { include: { productLine: true } } },
      }),
      db.salesCertification.findMany({
        where: { passed: false, user: { companyId: company.id } },
        include: { user: true, productLine: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      db.productUpdate.findMany({
        where: { productLine: { companyId: company.id } },
        include: { productLine: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

  const completed = enrollments.filter((e) => e.completedAt).length
  const completionRate = calcCompletionRate(completed, enrollments.length)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Visão geral</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          {' · '}{totalSellers} vendedores ativos
        </p>
      </div>
      <StatsCards totalSellers={totalSellers} activeCourses={activeCourses} completionRate={completionRate} uncertifiedCount={uncertified.length} />
      <div className="grid grid-cols-2 gap-6">
        <ProductBars companyId={company.id} />
        <SellerRanking companyId={company.id} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <AlertsTable uncertified={uncertified} />
        <ProductUpdates updates={productUpdates} />
      </div>
    </div>
  )
}