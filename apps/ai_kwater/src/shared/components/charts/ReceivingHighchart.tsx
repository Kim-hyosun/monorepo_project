'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 원수 유입 유량 시계열 */
  inflowTrend: Array<[number, number]>
  /** AI 예측 유량 시계열 */
  aiPredictTrend?: Array<[number, number]> | null
  /** 정수지 목표 수위 범위 (max/min) plotBand */
  targetRange?: { min: number; max: number } | null
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/aio/receiving/ReceivingHighchart.vue (754줄) 의
 * 원수 유입 + AI 예측 + 목표 수위 범위 1:1 변환.
 */
export default function ReceivingHighchart({
  inflowTrend,
  aiPredictTrend = null,
  targetRange = null,
  title = '원수 유입 / AI 예측',
  height = 280,
}: Props) {
  const series: Highcharts.SeriesOptionsType[] = [
    {
      type: 'area',
      name: '원수 유입 유량',
      data: inflowTrend,
      color: '#5cafff',
      lineWidth: 2,
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, 'rgba(92,175,255,0.4)'],
          [1, 'rgba(92,175,255,0)'],
        ],
      },
    },
  ]
  if (aiPredictTrend) {
    series.push({
      type: 'line',
      name: 'AI 예측',
      data: aiPredictTrend,
      color: '#34d399',
      lineWidth: 2,
      dashStyle: 'Dash',
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 52 },
    title: { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: {
      title: { text: 'm³/h' },
      plotBands:
        targetRange !== null
          ? [
              {
                from: targetRange.min,
                to: targetRange.max,
                color: 'rgba(110,231,183,0.08)',
                label: {
                  text: '목표 범위',
                  style: { color: '#c3eaff', fontSize: '10px' },
                  align: 'right',
                  x: -6,
                },
              },
            ]
          : undefined,
    },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
