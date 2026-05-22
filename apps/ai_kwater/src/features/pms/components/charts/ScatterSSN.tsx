'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface SsnPoint {
  /** 회전수 */
  rpm: number
  /** 양정 (수두) m */
  head: number
}

interface Props {
  points: SsnPoint[]
  /** 정격 운영점 */
  rated?: SsnPoint | null
  /** 현재 운영점 */
  current?: SsnPoint | null
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Scatter_SSN.vue —
 * 송수펌프 회전수 vs 양정 산점 + 정격/현재 운영점 강조.
 */
export default function ScatterSSN({
  points,
  rated = null,
  current = null,
  title = '회전수 vs 양정',
  height = 300,
}: Props) {
  const series: Highcharts.SeriesScatterOptions[] = [
    {
      type: 'scatter',
      name: '운영 분포',
      color: '#5cafff',
      data: points.map((p) => [p.rpm, p.head]),
      marker: { radius: 3, symbol: 'circle' },
    },
  ]
  if (rated) {
    series.push({
      type: 'scatter',
      name: '정격',
      color: '#fbbf24',
      data: [[rated.rpm, rated.head]],
      marker: { radius: 8, symbol: 'triangle', lineWidth: 2, lineColor: '#fff' },
    })
  }
  if (current) {
    series.push({
      type: 'scatter',
      name: '현재',
      color: '#34d399',
      data: [[current.rpm, current.head]],
      marker: { radius: 8, symbol: 'diamond', lineWidth: 2, lineColor: '#fff' },
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: {
      title: { text: '회전수 (rpm)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      title: { text: '양정 (m)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
