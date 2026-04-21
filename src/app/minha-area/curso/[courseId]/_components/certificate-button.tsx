'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface Props {
  vendorName: string
  courseTitle: string
  companyName: string
  completedAt: string
}

export function CertificateButton({ vendorName, courseTitle, companyName, completedAt }: Props) {
  const [generating, setGenerating] = useState(false)

  async function handleDownload() {
    setGenerating(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 850
      const ctx = canvas.getContext('2d')!

      // Fundo branco
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 1200, 850)

      // Borda vermelha superior
      ctx.fillStyle = '#E3001B'
      ctx.fillRect(0, 0, 1200, 12)

      // Borda vermelha inferior
      ctx.fillStyle = '#E3001B'
      ctx.fillRect(0, 838, 1200, 12)

      // Borda esquerda
      ctx.fillStyle = '#E3001B'
      ctx.fillRect(0, 0, 12, 850)

      // Borda direita
      ctx.fillStyle = '#E3001B'
      ctx.fillRect(1188, 0, 12, 850)

      // Logo CelNet
      const logo = new Image()
      logo.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        logo.onload = () => resolve()
        logo.onerror = () => resolve() // continua mesmo sem logo
        logo.src = 'https://res.cloudinary.com/ddjymk09s/image/upload/Black_White_Minimal_Modern_Simple_Bold_Business_Mag_Logo_kwkjgs'
      })
      if (logo.complete && logo.naturalWidth > 0) {
        ctx.drawImage(logo, 60, 40, 200, 70)
      }

      // Linha decorativa vermelha
      ctx.fillStyle = '#E3001B'
      ctx.fillRect(60, 140, 80, 4)

      // Título "CERTIFICADO DE CONCLUSÃO"
      ctx.fillStyle = '#1a1a1a'
      ctx.font = 'bold 18px Arial'
      ctx.letterSpacing = '4px'
      ctx.fillText('CERTIFICADO DE CONCLUSÃO', 60, 200)

      // Nome do vendedor
      ctx.fillStyle = '#1a1a1a'
      ctx.font = 'bold 64px Georgia'
      ctx.fillText(vendorName, 60, 310)

      // Linha separadora
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(60, 340)
      ctx.lineTo(1140, 340)
      ctx.stroke()

      // Texto "concluiu com êxito a trilha"
      ctx.fillStyle = '#6b7280'
      ctx.font = '22px Arial'
      ctx.fillText('concluiu com êxito a trilha de treinamento', 60, 400)

      // Nome da trilha
      ctx.fillStyle = '#E3001B'
      ctx.font = 'bold 36px Georgia'
      ctx.fillText(`"${courseTitle}"`, 60, 460)

      // Empresa
      ctx.fillStyle = '#6b7280'
      ctx.font = '20px Arial'
      ctx.fillText(`promovida por ${companyName}`, 60, 510)

      // Data
      const date = new Date(completedAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
      ctx.fillStyle = '#9ca3af'
      ctx.font = '16px Arial'
      ctx.fillText(`Concluído em ${date}`, 60, 560)

      // Linha assinatura
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(60, 660)
      ctx.lineTo(300, 660)
      ctx.stroke()

      ctx.fillStyle = '#1a1a1a'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(companyName, 60, 685)

      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px Arial'
      ctx.fillText('Responsável pelo treinamento', 60, 705)

      // Logo CorpSales canto inferior direito
      ctx.fillStyle = '#E3001B'
      ctx.font = 'bold 13px Arial'
      ctx.textAlign = 'right'
      ctx.fillText('Powered by CorpSales Academy', 1140, 800)

      // Download
      const link = document.createElement('a')
      link.download = `certificado-${courseTitle.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#f59e0b', color: '#fff',
        border: 'none', borderRadius: 10,
        padding: '10px 20px', fontSize: 13, fontWeight: 600,
        cursor: generating ? 'not-allowed' : 'pointer',
        opacity: generating ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {generating
        ? <><Loader2 style={{ width: 14, height: 14 }} /> Gerando...</>
        : <><Download style={{ width: 14, height: 14 }} /> Baixar certificado</>
      }
    </button>
  )
}