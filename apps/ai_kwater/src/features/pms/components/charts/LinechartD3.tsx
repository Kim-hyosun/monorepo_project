'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 3 시리즈 dashed line */
  series: Array<{ name: string; data: Array<[number, number]>; color?: string }>
  threshold?: number | null
  title?: string
  yLabel?: string
  height?: number
}

const PALETTE = ['#FF4369', '#5cafff', '#34d399']

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_d3.vue —
 * 3 시리즈 dashed line + 1 임계선.
 */
export default function LinechartD3({
  series,
  threshold = null,
  title,
  yLabel,
  height = 260,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 52 : 32 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: {
      title: { text: yLabel },
      plotLines:
        threshold !== null
          ? [
              {
                value: threshold,
                color: '#f00',
                width: 1.5,
                dashStyle: 'Dash',
                label: { text: '임계선', style: { color: '#f00' }, align: 'right', x: -6 },
              },
            ]
          : undefined,
    },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series: series.map<Highcharts.SeriesLineOptions>((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      color: s.color ?? PALETTE[i % PALETTE.length],
      lineWidth: 2,
      dashStyle: 'Dash',
      marker: { enabled: false },
    })),
  })

  return <BaseHighchart options={options} height={height} />
}
