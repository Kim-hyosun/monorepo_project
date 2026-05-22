'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 출구 탁도 시계열 */
  turbidityTrend: Array<[number, number]>
  /** AI 예측 탁도 시계열 */
  aiPredictTrend?: Array<[number, number]> | null
  /** 슬러지 농도 시계열 */
  sludgeDensityTrend?: Array<[number, number]> | null
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/aio/sedimentation/SedimentationHighchart.vue 의
 * 출구 탁도 + AI 예측 + 슬러지 농도(이중축) 1:1 변환.
 */
export default function SedimentationHighchart({
  turbidityTrend,
  aiPredictTrend = null,
  sludgeDensityTrend = null,
  title = '침전지 출구 탁도 / AI 예측 / 슬러지 농도',
  height = 280,
}: Props) {
  const series: Highcharts.SeriesOptionsType[] = [
    {
      type: 'line',
      name: '출구 탁도',
      data: turbidityTrend,
      yAxis: 0,
      color: '#5cafff',
      lineWidth: 2,
    },
  ]
  if (aiPredictTrend) {
    series.push({
      type: 'line',
      name: 'AI 예측 탁도',
      data: aiPredictTrend,
      yAxis: 0,
      color: '#34d399',
      lineWidth: 2,
      dashStyle: 'Dash',
    })
  }
  if (sludgeDensityTrend) {
    series.push({
      type: 'area',
      name: '슬러지 농도',
      data: sludgeDensityTrend,
      yAxis: 1,
      color: '#fbbf24',
      lineWidth: 1,
      fillOpacity: 0.25,
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 52 },
    title: { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' },
    xAxis: { type: 'datetime', labels: { format: '{value:%H:%M}' } },
    yAxis: [
      { title: { text: 'NTU' } },
      { opposite: true, title: { text: '슬러지 농도 (%)' }, gridLineWidth: 0 },
    ],
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
