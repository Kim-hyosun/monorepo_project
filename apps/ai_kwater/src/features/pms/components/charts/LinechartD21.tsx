'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 좌 y-axis 데이터 */
  primary: { name: string; data: Array<[number, number]>; unit?: string; color?: string }
  /** 우 y-axis 데이터 */
  secondary: { name: string; data: Array<[number, number]>; unit?: string; color?: string }
  /** primary 시리즈에 적용할 임계선 */
  primaryThreshold?: number | null
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_d21.vue —
 * dual axis dashed line + 좌측 시리즈 임계선.
 */
export default function LinechartD21({
  primary,
  secondary,
  primaryThreshold = null,
  title,
  height = 260,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 52 : 32 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: [
      {
        title: { text: primary.unit ?? primary.name },
        plotLines:
          primaryThreshold !== null
            ? [
                {
                  value: primaryThreshold,
                  color: '#f00',
                  width: 1.5,
                  dashStyle: 'Dash',
                  label: {
                    text: '임계선',
                    style: { color: '#f00' },
                    align: 'right',
                    x: -6,
                    y: 14,
                  },
                },
              ]
            : undefined,
      },
      {
        opposite: true,
        title: { text: secondary.unit ?? secondary.name },
        gridLineWidth: 0,
      },
    ],
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series: [
      {
        type: 'line',
        name: primary.name,
        data: primary.data,
        yAxis: 0,
        color: primary.color ?? '#FF4369',
        lineWidth: 2,
        dashStyle: 'Dash',
      },
      {
        type: 'line',
        name: secondary.name,
        data: secondary.data,
        yAxis: 1,
        color: secondary.color ?? '#5cafff',
        lineWidth: 2,
        dashStyle: 'Dash',
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
