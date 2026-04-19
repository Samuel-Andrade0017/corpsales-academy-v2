'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Upload } from 'lucide-react'
import Link from 'next/link'

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [newModule, setNewModule] = useState({ title: '', description: '', videoUrl: '' })
  const [addingModule, setAddingModule] = useState(false)
  const [quizContent, setQuizContent] = useState<Record<string, string>>({})
  const [quizExpanded, setQuizExpanded] = useState<Record<string, boolean>>({})
  const [quizLoading, setQuizLoading] = useState<Record<string, boolean>>({})
  const [quizQuestions, setQuizQuestions] = useState<Record<string, any[]>>({})
  const [uploadingVideo, setUploadingVideo] = useState(false)

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

  async function handleGenerateQuiz(moduleId: string) {
    const content = quizContent[moduleId]
    if (!content?.trim()) return
    setQuizLoading(l => ({ ...l, [moduleId]: true }))
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, content }),
      })
      const data = await res.json()
      if (data.questions) {
        setQuizQuestions(q => ({ ...q, [moduleId]: data.questions }))
      }
    } finally {
      setQuizLoading(l => ({ ...l, [moduleId]: false }))
    }
  }

  async function handleVideoUpload(file: File) {
    setUploadingVideo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setNewModule(m => ({ ...m, videoUrl: data.url }))
    } finally {
      setUploadingVideo(false)
    }
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
          <div key={mod.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">{i + 1}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{mod.title}</p>
                {mod.description && <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>}
                {mod.videoUrl && <p className="text-xs text-blue-600 mt-1 truncate">{mod.videoUrl}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuizExpanded(q => ({ ...q, [mod.id]: !q[mod.id] }))}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Quiz IA
                  {quizExpanded[mod.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button onClick={() => handleDeleteModule(mod.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {quizExpanded[mod.id] && (
              <div className="border-t border-border pt-3 space-y-3">
                <p className="text-xs text-muted-foreground">Cole o conteúdo do módulo e a IA gerará 5 perguntas automaticamente.</p>
                <textarea
                  placeholder="Cole aqui o conteúdo do módulo para gerar o quiz..."
                  value={quizContent[mod.id] || ''}
                  onChange={e => setQuizContent(q => ({ ...q, [mod.id]: e.target.value }))}
                  rows={4}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                />
                <button
                  onClick={() => handleGenerateQuiz(mod.id)}
                  disabled={quizLoading[mod.id] || !quizContent[mod.id]?.trim()}
                  className="flex items-center gap-2 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {quizLoading[mod.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {quizLoading[mod.id] ? 'Gerando com IA...' : 'Gerar quiz com IA'}
                </button>

                {quizQuestions[mod.id] && (
                  <div className="space-y-3 mt-2">
                    <p className="text-xs font-medium text-green-600">✅ {quizQuestions[mod.id].length} perguntas geradas com sucesso!</p>
                    {quizQuestions[mod.id].map((q: any, qi: number) => (
                      <div key={qi} className="bg-secondary/30 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium">{qi + 1}. {q.text}</p>
                        <div className="space-y-1">
                          {q.options.map((opt: string, oi: number) => (
                            <p key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correctIndex ? 'bg-green-100 text-green-800 font-medium' : 'text-muted-foreground'}`}>
                              {oi === q.correctIndex ? '✓' : '○'} {opt}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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

            {/* Campo de vídeo com upload */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="URL do vídeo (opcional) — cole um link ou faça upload"
                value={newModule.videoUrl}
                onChange={e => setNewModule(m => ({ ...m, videoUrl: e.target.value }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#E3001B]/20 focus:border-[#E3001B]"
              />
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${uploadingVideo ? 'opacity-50 cursor-not-allowed border-border text-muted-foreground' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}`}>
                  {uploadingVideo
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enviando vídeo...</>
                    : <><Upload className="w-3.5 h-3.5" /> Upload de vídeo</>
                  }
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={uploadingVideo}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleVideoUpload(file)
                  }}
                />
              </label>
              {newModule.videoUrl && (
                <p className="text-xs text-green-600">✅ Vídeo pronto: {newModule.videoUrl.slice(0, 50)}...</p>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={handleAddModule} disabled={loading || uploadingVideo} className="flex items-center gap-2 bg-[#E3001B] text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
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