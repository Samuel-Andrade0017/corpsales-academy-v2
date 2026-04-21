'use client'

import { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function DeleteCourseButton({ courseId, courseTitle }: { courseId: string, courseTitle: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/courses/${courseId}`, { method: 'DELETE' })
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
        style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '8px', border: 'none', background: 'rgba(227,0,27,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Trash2 style={{ width: 14, height: 14, color: '#E3001B' }} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 style={{ width: 16, height: 16, color: '#E3001B' }} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Excluir trilha</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20, color: '#6b7280' }} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px', lineHeight: 1.5 }}>
                Tem certeza que deseja excluir a trilha:
              </p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>
                "{courseTitle}"
              </p>
              <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '20px' }}>
                Esta ação não pode ser desfeita. Todos os módulos e matrículas serão removidos.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setOpen(false)}
                  style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#111827' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{ flex: 1, padding: '10px 16px', border: 'none', borderRadius: '10px', background: '#E3001B', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#ffffff', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Excluindo...' : 'Excluir trilha'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}