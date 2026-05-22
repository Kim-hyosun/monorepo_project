'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { ChartCategoryValue } from '@/features/ems/types/ems'

interface Props {
  items: ChartCategoryValue[]
  height?: number
  yLabel?: string
}

export default function CategoryBarChart({ items, height = 220, yLabel }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'column', height },
    xAxis: {
      type: 'category',
      categories: items.map((it) => it.name),
      labels: {
        style: { color: '#c3eaff', fontSize: '10px' },
        rotation: -25,
      },
    },
    yAxis: { title: { text: yLabel } },
    legend: { enabled: false },
    series: [
      {
        type: 'column',
        name: yLabel ?? '값',
        data: items.map((it) => it.value),
        color: '#5cafff',
        pointWidth: undefined,
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
