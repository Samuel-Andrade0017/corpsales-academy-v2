'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [newModule, setNewModule] = useState({ title: '', description: '', videoUrl: '' })
  const [addingModule, setAddingModule] = useState(false)

  useEffect(() => {
    fetch(`/api/courses/${params.courseId}`)
      .then(r => r.json())
      .then(setCourse)
  }, [params.courseId])

  async function handlePublish() {
    setSaving(true)
    await fetch(`/api/courses/${params.courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    })
    setCourse((c: any) => ({ ...c, isPublished: !c.isPublished }))
    setSaving(false)
  }

  async function handleAddModule() {
    if (!newModule.title.trim()) return
    setLoading(true)
    const res = await fetch(`/api/courses/${params.courseId}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newModule),
    })
    const mod = await res.json()
    setCourse((c: any) => ({ ...c, modules: [...(c.modules || []), mod] }))
    setNewModule({ title: '', description: '', videoUrl: '' })
    setAddingModule(false)
    setLoading(false)
  }

  async function handleDeleteModule(moduleId: string) {
    await fetch(`/api/courses/${params.courseId}/modules/${moduleId}`, { method: 'DELETE' })
    setCourse((c: any) => ({ ...c, modules: c.modules.filter((m: any) => m.id !== moduleId) }))
  }

  if (!course) return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>

  return (
    <div className="p-6 max-w-3xl">
      <Link href={`/courses/${params.courseId}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para a trilha
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{course.title}</h1>
          {course.description && <p className="text-sm text-muted-foreground mt-1">{course.description}</p>}
        </div>
        <button
          onClick={handlePublish}
          disabled={saving}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors ${course.isPublished ? 'bg-secondary text-foreground hover:bg-secondary/80' : 'bg-[#E3001B] text-white hover:bg-red-700'}`}
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {course.isPublished ? 'Despublicar' : 'Publicar trilha'}
        </button>
      </div>

      {/* Módulos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-sm">Módulos ({course.modules?.length || 0})</h2>
          <button
            onClick={() => setAddingModule(true)}
            className="flex items-center gap-1.5 text-xs text-[#E3001B] hover:text-red-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar módulo
          </button>
        </div>

        {course.modules?.map((mod: any, i: number) => (
          <div key={mod.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">{i + 1}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{mod.title}</p>
              {mod.description && <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>}
              {mod.videoUrl && <p className="text-xs text-blue-600 mt-1 truncate">{mod.videoUrl}</p>}
            </div>
            <button onClick={() => handleDeleteModule(mod.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {addingModule && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Título do módulo *"
              value={newModule.title}
              onChange={e => setNewModule(m => ({ ...m, title: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={newModule.description}
              onChange={e => setNewModule(m => ({ ...m, description: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
            />
            <input
              type="text"
              placeholder="URL do vídeo (opcional)"
              value={newModule.videoUrl}
              onChange={e => setNewModule(m => ({ ...m, videoUrl: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
            />
            <div className="flex gap-2">
              <button onClick={handleAddModule} disabled={loading} className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar módulo
              </button>
              <button onClick={() => setAddingModule(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}