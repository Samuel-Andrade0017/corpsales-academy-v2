'use client'

import { useState } from 'react'
import { UserPlus, X, Loader2 } from 'lucide-react'

export function InviteButton({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleInvite() {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSuccess(true)
        setEmail('')
        setTimeout(() => { setOpen(false); setSuccess(false) }, 2000)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Erro ao enviar convite')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Convidar vendedor
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Convidar vendedor</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <p className="text-sm text-green-600 text-center py-4">✅ Convite enviado com sucesso!</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  O vendedor receberá um email para criar a conta e entrar na sua organização.
                </p>
                <input
                  type="email"
                  placeholder="email@vendedor.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleInvite()}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B] mb-3"
                />
                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleInvite}
                    disabled={loading || !email.trim()}
                    className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 w-full justify-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Enviar convite
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}