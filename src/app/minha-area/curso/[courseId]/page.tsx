'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CursoPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [quizExpanded, setQuizExpanded] = useState<Record<string, boolean>>({})
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({}) // questionId -> selectedIndex
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({}) // moduleId -> submitted
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/curso/${courseId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [courseId])

async function handleSubmitQuiz(moduleId: string, questions: any[]) {
  setSubmitting(moduleId)
  try {
    console.log('quizAnswers:', quizAnswers)
    console.log('questions:', questions.map(q => ({ id: q.id, correctIndex: q.correctIndex })))

    const attempts = questions.map(q => ({
      questionId: q.id,
      moduleId,
      selectedIndex: quizAnswers[q.id] ?? -1,
      correct: quizAnswers[q.id] === q.correctIndex,
    }))

    console.log('attempts:', attempts)

    await fetch('/api/quiz/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempts }),
    })

    setQuizSubmitted(s => ({ ...s, [moduleId]: true }))
    const res = await fetch(`/api/curso/${courseId}`)
    const d = await res.json()
    setData(d)
  } finally {
    setSubmitting(null)
  }
}

  async function handleComplete(moduleId: string) {
    setCompleting(moduleId)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, courseId }),
      })
      const res = await fetch(`/api/curso/${courseId}`)
      const d = await res.json()
      setData(d)
    } finally {
      setCompleting(null)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#E3001B', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (!data) return null

  const { course, enrollment, quizAttempts = [] } = data
  const completedCount = enrollment?.moduleProgress?.filter((mp: any) => mp.completed).length || 0
  const totalModules = course.modules.length
  const progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/minha-area" style={{ color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', maxWidth: 200 }}>
                <div style={{ height: '100%', background: '#E3001B', borderRadius: 99, width: `${progressPct}%`, transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 12, color: '#888' }}>{completedCount}/{totalModules} módulos</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        {progressPct === 100 && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>🎉</p>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: '#22c55e' }}>Trilha concluída!</p>
            <p style={{ fontSize: 14, color: '#888' }}>Parabéns! Você completou todos os módulos desta trilha.</p>
          </div>
        )}

        {course.description && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: '#aaa' }}>{course.description}</p>
          </div>
        )}

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Módulos da trilha</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {course.modules.map((mod: any, i: number) => {
            const modProgress = enrollment?.moduleProgress?.find((mp: any) => mp.moduleId === mod.id)
            const isCompleted = modProgress?.completed ?? false
            const hasQuiz = mod.quiz?.questions?.length > 0
            const moduleAttempts = quizAttempts.filter((a: any) => a.moduleId === mod.id)
            const quizDone = quizSubmitted[mod.id] || moduleAttempts.length > 0
            const canComplete = !hasQuiz || quizDone
            const allAnswered = hasQuiz && mod.quiz.questions.every((q: any) => quizAnswers[q.id] !== undefined)

            const correctCount = hasQuiz && quizDone
              ? mod.quiz.questions.filter((q: any) => {
                  const attempt = moduleAttempts.find((a: any) => a.questionId === q.id)
                  return attempt?.correct
                }).length
              : 0

            return (
              <div key={mod.id} style={{
                background: isCompleted ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isCompleted ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 16,
                padding: '20px',
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: isCompleted ? 'rgba(34,197,94,0.15)' : 'rgba(227,0,27,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isCompleted
                      ? <CheckCircle style={{ width: 20, height: 20, color: '#22c55e' }} />
                      : <BookOpen style={{ width: 20, height: 20, color: '#E3001B' }} />
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#666' }}>Módulo {i + 1}</span>
                      {isCompleted && (
                        <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(34,197,94,0.3)' }}>
                          ✓ Concluído
                        </span>
                      )}
                      {hasQuiz && (
                        <span style={{ fontSize: 11, background: quizDone ? 'rgba(34,197,94,0.15)' : 'rgba(147,51,234,0.15)', color: quizDone ? '#22c55e' : '#a855f7', padding: '2px 8px', borderRadius: 99, border: `1px solid ${quizDone ? 'rgba(34,197,94,0.3)' : 'rgba(147,51,234,0.3)'}` }}>
                          {quizDone ? `✓ Quiz (${correctCount}/${mod.quiz.questions.length})` : '📝 Quiz obrigatório'}
                        </span>
                      )}
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 15, marginBottom: mod.description ? 6 : 0 }}>{mod.title}</p>
                    {mod.description && <p style={{ fontSize: 13, color: '#888' }}>{mod.description}</p>}

                    {/* Vídeo */}
                    {mod.videoUrl && (
                      <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                        <video src={mod.videoUrl} controls style={{ width: '100%', height: '100%' }} />
                      </div>
                    )}

                    {/* Quiz */}
                    {hasQuiz && !isCompleted && (
                      <div style={{ marginTop: 16 }}>
                        <button
                          onClick={() => setQuizExpanded(q => ({ ...q, [mod.id]: !q[mod.id] }))}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)', borderRadius: 8, padding: '8px 14px', color: '#a855f7', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                        >
                          📝 {quizDone ? 'Ver quiz' : 'Responder quiz'}
                          {quizExpanded[mod.id] ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
                        </button>

                        {quizExpanded[mod.id] && (
                          <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {mod.quiz.questions.map((q: any, qi: number) => {
                              const attempt = moduleAttempts.find((a: any) => a.questionId === q.id)
                              const selected = quizAnswers[q.id]
                              return (
                                <div key={q.id}>
                                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{qi + 1}. {q.text}</p>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {q.options.map((opt: string, oi: number) => {
                                      const isSelected = selected === oi
                                      const isCorrect = oi === q.correctIndex
                                      let bg = 'rgba(255,255,255,0.05)'
                                      let border = 'rgba(255,255,255,0.1)'
                                      let color = '#ccc'
                                      if (quizDone && attempt) {
                                        if (isCorrect) { bg = 'rgba(34,197,94,0.15)'; border = 'rgba(34,197,94,0.4)'; color = '#22c55e' }
                                        else if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.4)'; color = '#ef4444' }
                                      } else if (isSelected) {
                                        bg = 'rgba(147,51,234,0.2)'; border = 'rgba(147,51,234,0.5)'; color = '#a855f7'
                                      }
                                      return (
                                        <button
                                          key={oi}
                                          disabled={!!quizDone}
                                          onClick={() => setQuizAnswers(a => ({ ...a, [q.id]: oi }))}
                                          style={{ display: 'flex', alignItems: 'center', gap: 10, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '10px 14px', cursor: quizDone ? 'default' : 'pointer', textAlign: 'left', color, fontSize: 13, transition: 'all 0.2s' }}
                                        >
                                          <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                                            {quizDone && isCorrect ? '✓' : quizDone && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + oi)}
                                          </span>
                                          {opt}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}

                            {!quizDone && (
                              <button
                                onClick={() => handleSubmitQuiz(mod.id, mod.quiz.questions)}
                                disabled={!allAnswered || submitting === mod.id}
                                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, background: allAnswered ? '#a855f7' : 'rgba(147,51,234,0.3)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: allAnswered ? 'pointer' : 'not-allowed', opacity: submitting === mod.id ? 0.7 : 1 }}
                              >
                                {submitting === mod.id ? <Loader2 style={{ width: 14, height: 14 }} /> : '📤'}
                                {submitting === mod.id ? 'Enviando...' : 'Enviar respostas'}
                              </button>
                            )}

                            {quizDone && (
                              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '12px 16px' }}>
                                <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
                                  ✅ Quiz concluído! Você acertou {correctCount}/{mod.quiz.questions.length} questões.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botão concluir */}
                    {!isCompleted && (
                      <div style={{ marginTop: 16 }}>
                        {hasQuiz && !quizDone ? (
                          <p style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>
                            ⚠️ Responda o quiz para liberar a conclusão do módulo.
                          </p>
                        ) : (
                          <button
                            onClick={() => handleComplete(mod.id)}
                            disabled={completing === mod.id}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              background: '#E3001B', color: '#fff',
                              border: 'none', borderRadius: 10,
                              padding: '10px 20px', fontSize: 13, fontWeight: 600,
                              cursor: completing === mod.id ? 'not-allowed' : 'pointer',
                              opacity: completing === mod.id ? 0.7 : 1,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            {completing === mod.id
                              ? <><Loader2 style={{ width: 14, height: 14 }} /> Salvando...</>
                              : <><CheckCircle style={{ width: 14, height: 14 }} /> Marcar como concluído</>
                            }
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {course.modules.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
            <BookOpen style={{ width: 40, height: 40, color: '#444', margin: '0 auto 12px' }} />
            <p style={{ color: '#888', fontSize: 14 }}>Nenhum módulo disponível ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}