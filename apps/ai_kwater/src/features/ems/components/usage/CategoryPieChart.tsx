'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { ChartCategoryValue } from '@/features/ems/types/ems'

interface Props {
  items: ChartCategoryValue[]
  height?: number
}

const PALETTE = [
  '#5cafff',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f87171',
  '#7dd3fc',
  '#fb923c',
  '#22d3ee',
]

export default function CategoryPieChart({ items, height = 220 }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'pie', height },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: { color: '#c3eaff', fontSize: '10px' },
    },
    series: [
      {
        type: 'pie',
        innerSize: '50%',
        data: items.map((it, i) => ({
          name: it.name,
          y: it.value,
          color: PALETTE[i % PALETTE.length],
        })),
        showInLegend: true,
        dataLabels: { enabled: false },
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
