'use client'

import { useState } from 'react'
import { Copy, Check, Link } from 'lucide-react'

export function InviteLinkButton() {
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function generateLink() {
    setLoading(true)
    try {
      const res = await fetch('/api/invite-link', { method: 'POST' })
      const data = await res.json()
      const url = `${window.location.origin}/invite/${data.token}`
      setLink(url)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={generateLink}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        <Link className="w-4 h-4" />
        {loading ? 'Gerando...' : 'Gerar link de convite'}
      </button>

      {open && link && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Link de convite</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Compartilhe esse link com seus vendedores via WhatsApp. Ao acessar, eles entrarão direto na sua empresa.
            </p>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm flex-1 break-all">{link}</p>
              <button onClick={copyLink} className="flex-shrink-0 p-1 hover:opacity-70 transition">
                {copied
                  ? <Check className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              ⚠️ Cada vez que gerar um novo link, o anterior para de funcionar.
            </p>
          </div>
        </div>
      )}
    </>
  )
}