'use client'

import { useMutation } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'

import { SajuForm } from '@/components/SajuForm'
import { SajuResult } from '@/components/SajuResult'
import type { SajuInput } from '@/lib/schema'
import type { ManseApiResult, SajuApiResponse } from '@/lib/types'

async function callSaju(input: SajuInput): Promise<ManseApiResult> {
  const { birthDate, birthTime, timeUnknown, gender } = input
  const res = await fetch('/api/saju', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthDate, birthTime, timeUnknown, gender }),
  })
  const json = (await res.json()) as SajuApiResponse
  if (!json.ok) {
    // page-level UI 에서 보여줄 에러 메시지를 throw 메시지로 전달
    throw new Error(json.error.message || '요청에 실패했습니다.')
  }
  return json.data
}

export default function Home() {
  const [result, setResult] = useState<ManseApiResult | null>(null)
  const mutation = useMutation({
    mutationFn: callSaju,
    onSuccess: (data) => setResult(data),
  })

  return (
    <main className='min-h-dvh bg-gradient-to-b from-[oklch(0.97_0.02_280)] to-[oklch(0.99_0.005_60)] dark:from-[oklch(0.18_0.03_280)] dark:to-[oklch(0.16_0.02_280)]'>
      <div className='mx-auto w-full max-w-2xl px-4 py-8 sm:py-12'>
        <header className='mb-8 text-center'>
          <div className='bg-primary/15 text-primary mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium'>

            사주 만세력
          </div>
          <h1 className='text-foreground text-2xl font-bold sm:text-3xl'>재미로 보는 사주 분석</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            생년월일·시간·성별을 입력하면<br /> 사주에 대해 분석한 내용과 이 내용을 바탕으로한 프롬프트를 제공해드립니다.<br />
            단순한 재미로 즐겨주세요.
          </p>
        </header>

        {result ? (
          <SajuResult
            data={result}
            onReset={() => {
              setResult(null)
              mutation.reset()
            }}
          />
        ) : (
          <>
            <SajuForm onSubmit={(input) => mutation.mutate(input)} loading={mutation.isPending} />
            {mutation.isError ? (
              <div className='border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-md border px-4 py-3 text-sm'>
                <div className='font-semibold'>분석 실패</div>
                <div className='mt-0.5 text-xs opacity-90'>{mutation.error?.message}</div>
              </div>
            ) : null}
          </>
        )}

        <footer className='text-muted-foreground mt-10 text-center text-[11px]'>
          <p>사주는 재미로만 즐깁시다<br />© 2026 Hyosun. All rights reserved. Developed by Hyosun using Next.js & TypeScript.
          </p>
          <p><a href='https://github.com/golbin/ssaju' target='_blank' rel='noopener noreferrer' className='font-semibold'>
            골빈해커
          </a>님의 ssaju패키지를 가지고 api를 만들어 연결한 사이트입니다.</p>
        </footer>
      </div>
    </main >
  )
}
