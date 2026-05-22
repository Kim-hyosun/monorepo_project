'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  data: Array<[number, number]>
  title?: string
  yLabel?: string
  color?: string
  height?: number
  /** 평균선 표시 (yAxis plotLine) */
  average?: number | null
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart2.vue — line + 평균 plot line.
 */
export default function Linechart2({
  data,
  title,
  yLabel,
  color = '#34d399',
  height = 220,
  average = null,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 48 : 28 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: {
      title: { text: yLabel },
      plotLines:
        average !== null
          ? [
              {
                value: average,
                color: '#c3eaff66',
                width: 1,
                dashStyle: 'Dot',
                label: {
                  text: `평균 ${average.toFixed(2)}`,
                  style: { color: '#c3eaff' },
                  align: 'right',
                  x: -4,
                  y: 12,
                },
              },
            ]
          : undefined,
    },
    legend: { enabled: false },
    series: [
      {
        type: 'line',
        name: title ?? 'value',
        data,
        color,
        lineWidth: 2,
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
