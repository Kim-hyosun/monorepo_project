'use client'

import dynamic from 'next/dynamic'

const EChartsBars = dynamic(() => import('@/features/chart-demo/components/EChartsBars'), {
  ssr: false,
  loading: () => <div className='text-muted-foreground text-sm'>차트 로딩 중…</div>,
})

const HighchartsLine = dynamic(() => import('@/features/chart-demo/components/HighchartsLine'), {
  ssr: false,
  loading: () => <div className='text-muted-foreground text-sm'>차트 로딩 중…</div>,
})

export default function ChartDemoPage() {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='mb-2 text-xl font-semibold'>차트 데모</h2>
        <p className='text-muted-foreground text-sm'>
          Highcharts 단일 stack — dynamic import + ssr:false 패턴으로 로드.
        </p>
      </div>

      <section className='rounded-lg border p-4'>
        <h3 className='mb-3 text-sm font-medium'>Highcharts (column)</h3>
        <EChartsBars />
      </section>

      <section className='rounded-lg border p-4'>
        <h3 className='mb-3 text-sm font-medium'>Highcharts (line)</h3>
        <HighchartsLine />
      </section>
    </div>
  )
}
