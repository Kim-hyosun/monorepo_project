'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface GacPoint {
  /** 흡착탑 운영 시간 (h) */
  hours: number
  /** 출구 탁도 NTU */
  turbidity: number
  /** 정상/주의/경보 */
  state: 'normal' | 'warning' | 'alert'
}

interface Props {
  points: GacPoint[]
  title?: string
  height?: number
}

const STATE_COLOR: Record<GacPoint['state'], string> = {
  normal: '#5cafff',
  warning: '#fbbf24',
  alert: '#f87171',
}

const STATE_LABEL: Record<GacPoint['state'], string> = {
  normal: '정상',
  warning: '주의',
  alert: '경보',
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Scatter_gac.vue —
 * GAC 흡착탑 운영 시간 vs 출구 탁도 상태 산점.
 */
export default function ScatterGac({
  points,
  title = 'GAC 운영시간 vs 출구탁도',
  height = 300,
}: Props) {
  const groups: Record<GacPoint['state'], GacPoint[]> = { normal: [], warning: [], alert: [] }
  points.forEach((p) => groups[p.state].push(p))

  const series: Highcharts.SeriesScatterOptions[] = (
    ['normal', 'warning', 'alert'] as GacPoint['state'][]
  ).map((state) => ({
    type: 'scatter',
    name: STATE_LABEL[state],
    color: STATE_COLOR[state],
    data: groups[state].map((p) => [p.hours, p.turbidity]),
    marker: { radius: 5, symbol: 'circle' },
  }))

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: {
      title: { text: '운영시간 (h)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      title: { text: '출구탁도 (NTU)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
