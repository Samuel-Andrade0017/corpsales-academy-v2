'use client'

import { useState, useEffect } from 'react'
import { Plus, Package, X, Loader2 } from 'lucide-react'

const categories = [
  { value: 'FIBRA', label: 'Fibra' },
  { value: 'MOVEL', label: 'Móvel' },
  { value: 'TV', label: 'TV' },
  { value: 'B2B', label: 'B2B' },
  { value: 'COMBO', label: 'Combo' },
  { value: 'OUTRO', label: 'Outro' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', category: 'OUTRO' })

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const product = await res.json()
      setProducts(p => [product, ...p])
      setForm({ name: '', description: '', category: 'OUTRO' })
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const categoryIcons: Record<string, string> = {
    FIBRA: '🌐', MOVEL: '📱', TV: '📺', B2B: '🏢', COMBO: '📦', OUTRO: '📦'
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E3001B] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </button>
      </div>

      {/* Modal de cadastro */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Novo produto</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nome do produto *</label>
                <input
                  type="text"
                  placeholder="Ex: Claro Fibra 400MB"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Categoria</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Descrição (opcional)</label>
                <textarea
                  placeholder="Descreva o produto..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name.trim()}
                  className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex-1 justify-center font-medium"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar produto
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 border border-border rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-1">Nenhum produto cadastrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            Cadastre os produtos que seus vendedores precisam dominar.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Cadastrar primeiro produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-xl p-5 hover:border-[#E3001B]/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E3001B]/10 flex items-center justify-center text-lg">
                  {categoryIcons[product.category] || '📦'}
                </div>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {categories.find(c => c.value === product.category)?.label || product.category}
                </span>
              </div>
              <h3 className="font-medium mb-1">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-3">{product.courses?.length || 0} trilhas vinculadas</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}