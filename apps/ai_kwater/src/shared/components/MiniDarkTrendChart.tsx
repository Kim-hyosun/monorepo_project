'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  data: Array<[number, number]>
  color?: string
  yLabel?: string
  height?: number
}

/**
 * RightContents 등에서 사용하는 작은 다크 area trend.
 * features/dashboard 의 DashboardTrendChart 와 유사하지만 title 없이 더 단순.
 */
export default function MiniDarkTrendChart({
  data,
  color = '#5cafff',
  yLabel,
  height = 180,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 20, marginBottom: 28 },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d %H:%M}' } },
    yAxis: { title: { text: yLabel } },
    legend: { enabled: false },
    series: [
      {
        type: 'area',
        name: yLabel ?? 'value',
        data,
        color,
        lineWidth: 2,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${color}66`],
            [1, `${color}00`],
          ],
        },
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
