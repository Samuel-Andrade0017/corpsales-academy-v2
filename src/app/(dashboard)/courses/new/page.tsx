'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.id) router.push(`/courses/${data.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <Link
        href="/courses"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para trilhas
      </Link>

      <h1 className="text-xl font-semibold mb-6">Nova trilha de treinamento</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Título da trilha <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Claro Fibra — Planos residenciais"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Descrição</label>
          <textarea
            placeholder="Descreva o objetivo desta trilha de treinamento..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B] resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !form.title.trim()}
            className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-5 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Criar trilha
          </button>
          <Link
            href="/courses"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
