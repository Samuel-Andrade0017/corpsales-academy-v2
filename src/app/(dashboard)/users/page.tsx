import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getInitials, calcCompletionRate } from '@/lib/utils'
import { InviteLinkButton } from './_components/invite-link-button'

export default async function UsersPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })
  if (!dbUser?.company) redirect('/api/seed-company')
  const company = dbUser.company

  const [users, productLineCount] = await Promise.all([
    db.user.findMany({
      where: { companyId: company.id },
      include: {
        certifications: { where: { passed: true } },
        enrollments: { where: { completedAt: { not: null } } },
      },
      orderBy: { name: 'asc' },
    }),
    db.productLine.count({ where: { companyId: company.id } }),
  ])

  const roleLabel: Record<string, string> = {
    ADMIN: 'Admin',
    MANAGER: 'Gerente',
    EMPLOYEE: 'Vendedor',
  }

  const roleBadge: Record<string, string> = {
    ADMIN: 'bg-purple-50 text-purple-700',
    MANAGER: 'bg-blue-50 text-blue-700',
    EMPLOYEE: 'bg-secondary text-muted-foreground',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Vendedores</h1>
          <p className="text-sm text-muted-foreground">{users.length} usuários cadastrados</p>
        </div>
        <InviteLinkButton />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendedor</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Perfil</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Certificações</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trilhas concluídas</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                  Nenhum usuário cadastrado. Convide sua equipe!
                </td>
              </tr>
            ) : users.map((user) => {
              const certPct = calcCompletionRate(user.certifications.length, productLineCount || 1)
              return (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs font-medium text-[#0C447C] flex-shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[user.role]}`}>
                      {roleLabel[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${certPct}%`,
                            background: certPct >= 80 ? '#3B6D11' : certPct >= 50 ? '#185FA5' : '#A32D2D',
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{certPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{user.enrollments.length}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}