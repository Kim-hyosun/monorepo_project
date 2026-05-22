'use client'

import { ProcessRightContentsLayout } from '@/shared/components/ProcessRightContentsLayout'
import type { OzoneLatest } from '@/features/ozone/types/ozone'

interface Props {
  data: OzoneLatest
}

export function OzoneRightContents({ data }: Props) {
  const aiVsCurrent =
    data.ai_oz_dose !== null && data.oz_dose !== null
      ? Number((data.ai_oz_dose - data.oz_dose).toFixed(2))
      : null

  return (
    <ProcessRightContentsLayout
      title='AI 오존 추천'
      chart={
        <div className='rounded border border-[var(--aio-panel-border)] bg-black/30 p-3 text-center'>
          <div className='text-xs text-[var(--aio-subtitle)]'>AI 추천 오존 주입율</div>
          <div
            className='mt-1 text-3xl font-bold text-emerald-200'
            style={{ textShadow: '0 0 12px rgba(110,231,183,0.45)' }}
          >
            {data.ai_oz_dose === null ? '—' : data.ai_oz_dose.toFixed(2)}
            <span className='ml-1 text-xs text-[var(--aio-subtitle)]'>mg/L</span>
          </div>
        </div>
      }
      kpis={[
        { label: '현재 주입율', value: data.oz_dose, unit: 'mg/L', delta: aiVsCurrent, digits: 2 },
        { label: '오존 농도', value: data.oz_density, unit: 'mg/L', digits: 2 },
        { label: '발생기 부하', value: data.oz_generator_load, unit: '%', digits: 0 },
      ]}
    />
  )
}
