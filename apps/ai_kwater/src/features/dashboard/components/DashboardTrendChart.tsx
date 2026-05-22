'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  data: Array<[number, number]>
  title: string
  yLabel?: string
  enableExport?: boolean
}

const DARK_GRADIENT: Highcharts.GradientColorObject = {
  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  stops: [
    [0, 'rgba(92,175,255,0.4)'],
    [1, 'rgba(92,175,255,0)'],
  ],
}

/**
 * Dashboard 전용 다크 테마 트렌드 차트.
 * 일반 light 트렌드 차트는 features/receiving/components/TrendLineChart 사용.
 */
export default function DashboardTrendChart({ data, title, yLabel, enableExport }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height: 280, marginTop: 50 },
    title: {
      text: title,
      style: { color: '#c3eaff', fontSize: '13px' },
      align: 'left',
    },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d %H:%M}' } },
    yAxis: { title: { text: yLabel } },
    series: [
      {
        type: 'area',
        name: title,
        data,
        color: '#5cafff',
        lineWidth: 2,
        fillColor: DARK_GRADIENT,
      },
    ],
  })

  return <BaseHighchart options={options} height={280} enableExport={enableExport} />
}
