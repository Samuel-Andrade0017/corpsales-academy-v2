'use client'

import { useState } from 'react'
import { Copy, Check, Link, X, Share2 } from 'lucide-react'

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

  function shareWhatsApp() {
    const text = `Acesse a plataforma de treinamento da nossa empresa: ${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <>
      <button
        onClick={generateLink}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        <Link className="w-4 h-4" />
        {loading ? 'Carregando...' : 'Link de convite'}
      </button>

      {open && link && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base font-semibold">Link de convite</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground mb-4">
                Compartilhe esse link com seus vendedores. Ao acessar, eles entrarão direto na plataforma da sua empresa.
              </p>

              {/* Link box */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-xl mb-5">
                <p className="text-sm flex-1 break-all text-foreground font-mono leading-relaxed">{link}</p>
                <button
                  onClick={copyLink}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-background transition"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4 text-muted-foreground" />
                  }
                </button>
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar link'}
                </button>
                <button
                  onClick={shareWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}