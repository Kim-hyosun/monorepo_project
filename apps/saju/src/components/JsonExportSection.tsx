'use client'

import { Check, Copy, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'

interface Props {
  data: unknown
}

const AI_PROMPT_HINT = `위는 사주 만세력 API 응답 JSON 입니다.
다음을 분석해주세요:
1. 사주 원국의 강한 점과 약한 점
2. 오행 분포에서 부족한 기운 보완 방법
3. 현재 대운의 흐름과 다음 대운의 전환점
4. 길신·흉신을 고려한 일상의 주의점
5. 일간(나의 본성)에 맞는 직업·관계 조언`

export function JsonExportSection({ data }: Props) {
  const [copied, setCopied] = useState<'json' | 'withPrompt' | null>(null)

  const handleCopy = async (kind: 'json' | 'withPrompt') => {
    const json = JSON.stringify(data, null, 2)
    const text = kind === 'withPrompt' ? `\`\`\`json\n${json}\n\`\`\`\n\n${AI_PROMPT_HINT}` : json
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2200)
    } catch {
      // fallback — execCommand 폐기 단계라 모달 없이 silently fail
      setCopied(null)
    }
  }

  return (
    <div className='from-primary/8 to-card rounded-xl border bg-gradient-to-br p-5 shadow-sm'>
      <div className='flex items-center gap-2'>
        <Sparkles className='text-primary size-4' />
        <h3 className='text-base font-semibold'>AI 로 더 자세한 해석 받기</h3>
      </div>

      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
        아래 버튼으로 결과 JSON 을 복사한 뒤{' '}
        <span className='text-foreground font-medium'>ChatGPT · Claude · Gemini</span> 같은 AI 도구에
        붙여넣으면 사주 데이터를 기반으로 더 풍부한 해석을 받을 수 있습니다. 추천 프롬프트도 함께 복사할 수
        있어요.
      </p>

      <ul className='text-muted-foreground mt-3 space-y-1 text-xs'>
        <li className='flex items-start gap-1.5'>
          <span className='bg-primary/70 mt-1.5 inline-block size-1.5 shrink-0 rounded-full' />
          <span>본 데이터는 사용자가 입력한 생년월일·시간 기반으로 계산된 객관적 사주 원국입니다</span>
        </li>
        <li className='flex items-start gap-1.5'>
          <span className='bg-primary/70 mt-1.5 inline-block size-1.5 shrink-0 rounded-full' />
          <span>AI 해석은 참고용이며, 중요한 결정은 전문가 상담을 권합니다</span>
        </li>
        <li className='flex items-start gap-1.5'>
          <span className='bg-primary/70 mt-1.5 inline-block size-1.5 shrink-0 rounded-full' />
          <span>개인정보(이름·연락처)는 JSON 에 포함되지 않습니다 — 안심하고 공유하세요</span>
        </li>
      </ul>

      <div className='mt-4 flex flex-wrap gap-2'>
        <Button
          type='button'
          variant='default'
          size='lg'
          onClick={() => handleCopy('withPrompt')}
          className='flex-1 sm:flex-none'
        >
          {copied === 'withPrompt' ? (
            <>
              <Check />
              복사됨
            </>
          ) : (
            <>
              <Copy />
              JSON + AI 프롬프트 복사
            </>
          )}
        </Button>
        <Button
          type='button'
          variant='outline'
          size='lg'
          onClick={() => handleCopy('json')}
          className='flex-1 sm:flex-none'
        >
          {copied === 'json' ? (
            <>
              <Check />
              복사됨
            </>
          ) : (
            <>
              <Copy />
              JSON 만 복사
            </>
          )}
        </Button>
      </div>

      <details className='mt-3'>
        <summary className='text-muted-foreground hover:text-foreground cursor-pointer text-xs'>
          추천 프롬프트 미리보기
        </summary>
        <pre className='bg-muted text-muted-foreground mt-2 overflow-auto rounded-md p-3 text-[11px] whitespace-pre-wrap'>
          {AI_PROMPT_HINT}
        </pre>
      </details>
    </div>
  )
}
