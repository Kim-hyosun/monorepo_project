'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { ManseApiResult } from '@/lib/types'
import { Button } from '@/shared/ui/button'

interface Props {
  data: ManseApiResult
  onReset: () => void
}

export function SajuResult({ data, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.compactData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-foreground text-xl font-bold'>사주 분석 결과</h2>
        <button
          type='button'
          onClick={onReset}
          className='text-primary text-sm font-medium hover:underline'
        >
          ← 다시 입력
        </button>
      </div>

      <article className='bg-card text-card-foreground rounded-xl border p-5 shadow-sm sm:p-7'>
        <h3 className='mb-5 flex items-center gap-2 text-lg font-semibold'>
          <span className='bg-primary/15 text-primary inline-flex size-8 items-center justify-center rounded-full text-sm'>
            풀이
          </span>
          사주 해석
        </h3>
        <div className='text-foreground/90 [&_blockquote]:border-primary/40 [&_blockquote]:text-muted-foreground [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 leading-7 wrap-break-word'>
          <ReactMarkdown>{data.interpretation}</ReactMarkdown>
        </div>
      </article>

      <div className='flex justify-end'>
        <Button type='button' variant='outline' size='lg' onClick={handleCopy}>
          {copied ? <Check /> : <Copy />}
          {copied ? 'AI 프롬프트용 데이터 복사됨' : 'AI 프롬프트용 데이터 복사'}
        </Button>
      </div>
    </div>
  )
}
