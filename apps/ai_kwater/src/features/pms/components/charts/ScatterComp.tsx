'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface CompPoint {
  /** 모터 DE 전류 */
  motorDe: number
  /** 펌프 DE 전류 */
  pumpDe: number
}

interface Props {
  /** 시리즈 별 비교 데이터 */
  groups: Array<{ name: string; color?: string; points: CompPoint[] }>
  title?: string
  height?: number
}

const PALETTE = ['#5cafff', '#34d399', '#fbbf24', '#a78bfa', '#f87171', '#7dd3fc']

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Scatter_comp.vue —
 * 모터/펌프 전류 비교 산점. 다중 그룹 비교.
 */
export default function ScatterComp({
  groups,
  title = '모터 vs 펌프 전류 비교',
  height = 300,
}: Props) {
  const series: Highcharts.SeriesScatterOptions[] = groups.map((g, i) => ({
    type: 'scatter',
    name: g.name,
    color: g.color ?? PALETTE[i % PALETTE.length],
    data: g.points.map((p) => [p.motorDe, p.pumpDe]),
    marker: { radius: 4, symbol: 'circle' },
  }))

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: {
      title: { text: '모터 DE 전류 (A)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      title: { text: '펌프 DE 전류 (A)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
