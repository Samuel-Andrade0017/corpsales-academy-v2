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
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Link style={{ width: 16, height: 16, color: '#E3001B' }} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Link de convite</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}>
                <X style={{ width: 20, height: 20, color: '#6b7280' }} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.5 }}>
                Compartilhe esse link com seus vendedores via WhatsApp. Ao acessar, eles entrarão direto na plataforma da sua empresa.
              </p>

              {/* Link box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', flex: 1, wordBreak: 'break-all', fontFamily: 'monospace', color: '#111827', lineHeight: 1.6 }}>{link}</span>
                <button onClick={copyLink} style={{ border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0, padding: 4 }}>
                  {copied ? <Check style={{ width: 18, height: 18, color: '#22c55e' }} /> : <Copy style={{ width: 18, height: 18, color: '#6b7280' }} />}
                </button>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={copyLink}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#111827' }}
                >
                  {copied ? <Check style={{ width: 16, height: 16, color: '#22c55e' }} /> : <Copy style={{ width: 16, height: 16 }} />}
                  {copied ? 'Copiado!' : 'Copiar link'}
                </button>
                <button
                  onClick={shareWhatsApp}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', border: 'none', borderRadius: '10px', background: '#22c55e', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#ffffff' }}
                >
                  <Share2 style={{ width: 16, height: 16 }} />
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