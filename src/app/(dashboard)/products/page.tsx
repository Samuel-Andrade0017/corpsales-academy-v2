import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export default async function ProductsPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  })

  if (!dbUser?.company) redirect('/api/seed-company')

  const products = await db.productLine.findMany({
    where: { companyId: dbUser.company.id },
    include: { courses: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
          + Novo produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">📦</p>
          <p className="font-medium mb-1">Nenhum produto cadastrado</p>
          <p className="text-sm text-muted-foreground">
            Cadastre os produtos que seus vendedores precisam dominar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                  📦
                </div>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {product.courses.length} trilhas
                </span>
              </div>
              <h3 className="font-medium mb-1">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}