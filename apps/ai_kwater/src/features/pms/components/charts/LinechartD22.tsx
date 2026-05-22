'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 좌 y-axis 데이터 — area */
  primary: { name: string; data: Array<[number, number]>; unit?: string; color?: string }
  /** 우 y-axis 데이터 — dashed line */
  secondary: { name: string; data: Array<[number, number]>; unit?: string; color?: string }
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_d22.vue —
 * dual axis (좌측 area + 우측 dashed line) 혼합.
 */
export default function LinechartD22({ primary, secondary, title, height = 260 }: Props) {
  const primaryColor = primary.color ?? '#34d399'
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 52 : 32 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: [
      { title: { text: primary.unit ?? primary.name } },
      { opposite: true, title: { text: secondary.unit ?? secondary.name }, gridLineWidth: 0 },
    ],
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series: [
      {
        type: 'area',
        name: primary.name,
        data: primary.data,
        yAxis: 0,
        color: primaryColor,
        lineWidth: 1,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${primaryColor}66`],
            [1, `${primaryColor}00`],
          ],
        },
      },
      {
        type: 'line',
        name: secondary.name,
        data: secondary.data,
        yAxis: 1,
        color: secondary.color ?? '#FF4369',
        lineWidth: 2,
        dashStyle: 'Dash',
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
