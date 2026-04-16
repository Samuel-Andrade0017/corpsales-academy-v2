'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === 'true'
  )

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url } = await res.json()
      window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">Configurações</h1>

      {success && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 mb-6 text-sm">
          <CheckCircle className="w-4 h-4" />
          Assinatura ativada com sucesso! Obrigado!
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-semibold">Plano Pro</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Treinamentos ilimitados, vendedores ilimitados, relatórios completos.
            </p>
          </div>
          <span className="text-2xl font-bold">R$ 497<span className="text-sm font-normal text-muted-foreground">/mês</span></span>
        </div>

        <ul className="space-y-2 mb-6">
          {[
            'Trilhas de treinamento ilimitadas',
            'Vendedores ilimitados',
            'Certificações por produto',
            'Dashboard de performance',
            'Suporte prioritário',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          {loading ? 'Redirecionando...' : 'Assinar agora'}
        </button>
      </div>
    </div>
  )
}