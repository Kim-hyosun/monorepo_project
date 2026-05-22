'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 단일 시리즈 시계열 (dashed line) */
  data: Array<[number, number]>
  /** 임계선 yAxis 위치. null 이면 표시 안 함 */
  threshold?: number | null
  title?: string
  height?: number
  yLabel?: string
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Linechart_d.vue (292줄) 의
 * dashed line + markLine 임계선 1:1 옵션.
 * - 라인은 점선(dashStyle: 'Dash'), 컬러 #FF4369
 * - yAxis plotLine 으로 임계선 + "임계선" 라벨 (end 위치 빨강)
 */
export default function LinechartD({ data, threshold = null, title, height = 240, yLabel }: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: title ? 52 : 30 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d %H:%M}' } },
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
                zIndex: 5,
                label: {
                  text: '임계선',
                  align: 'right',
                  style: { color: '#f00', fontSize: '11px' },
                  x: -6,
                  y: 14,
                },
              },
            ]
          : undefined,
    },
    legend: { enabled: false },
    series: [
      {
        type: 'line',
        name: title ?? '시계열',
        data,
        color: '#FF4369',
        lineWidth: 2,
        dashStyle: 'Dash',
        marker: { enabled: true, radius: 3, symbol: 'circle' },
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
