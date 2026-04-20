'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Copy, Check, Link, X, Share2 } from 'lucide-react'

export function InviteLinkButton() {
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '1rem', width: '100%', maxWidth: '28rem', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid hsl(var(--border))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'hsl(var(--primary) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link style={{ width: 16, height: 16, color: 'hsl(var(--primary))' }} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Link de convite</h2>
          </div>
          <button onClick={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X style={{ width: 16, height: 16, color: 'hsl(var(--muted-foreground))' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
            Compartilhe esse link com seus vendedores. Ao acessar, eles entrarão direto na plataforma da sua empresa.
          </p>

          {/* Link box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'hsl(var(--muted))', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', flex: 1, wordBreak: 'break-all', fontFamily: 'monospace', margin: 0 }}>{link}</p>
            <button onClick={copyLink} style={{ flexShrink: 0, width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {copied ? <Check style={{ width: 16, height: 16, color: '#22c55e' }} /> : <Copy style={{ width: 16, height: 16 }} />}
            </button>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={copyLink} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.625rem 1rem', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              {copied ? <Check style={{ width: 16, height: 16, color: '#22c55e' }} /> : <Copy style={{ width: 16, height: 16 }} />}
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <button onClick={shareWhatsApp} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.625rem 1rem', borderRadius: '0.75rem', border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              <Share2 style={{ width: 16, height: 16 }} />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )

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

      {mounted && open && link && createPortal(modal, document.body)}
    </>
  )
}