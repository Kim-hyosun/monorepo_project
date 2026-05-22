'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** S-단계 (4단계) 시계열 */
  data: Array<[number, number]>
  /** AI 추천 운영 구간 — plotBand */
  aiRecommendBands?: Array<{ from: number; to: number; label?: string }> | null
  /** 3단계 비교 시계열 (옵션) */
  compareData?: Array<[number, number]> | null
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/aio/filter/chart/AILocationChartS.vue —
 * 4단계 S 분기용 AILocation. 3단계 비교 시리즈 + AI 추천 plotBand.
 */
export default function AILocationChartS({
  data,
  aiRecommendBands = null,
  compareData = null,
  title = '여과지 수위 (4단계) + AI 추천 구간',
  height = 280,
}: Props) {
  const series: Highcharts.SeriesOptionsType[] = [
    {
      type: 'spline',
      name: '4단계 수위',
      data,
      color: '#5cafff',
      lineWidth: 2,
    },
  ]
  if (compareData) {
    series.push({
      type: 'spline',
      name: '3단계 수위',
      data: compareData,
      color: '#a78bfa',
      lineWidth: 2,
      dashStyle: 'Dash',
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 52 },
    title: { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' },
    xAxis: {
      type: 'datetime',
      labels: { format: '{value:%H:%M}' },
      plotBands:
        aiRecommendBands && aiRecommendBands.length > 0
          ? aiRecommendBands.map((b) => ({
              from: b.from,
              to: b.to,
              color: 'rgba(110,231,183,0.12)',
              borderColor: '#34d39966',
              borderWidth: 1,
              label: b.label
                ? {
                    text: b.label,
                    style: { color: '#34d399', fontSize: '10px' },
                    align: 'center',
                    y: 16,
                  }
                : undefined,
            }))
          : undefined,
    },
    yAxis: { title: { text: 'm' } },
    legend: { itemStyle: { color: '#c3eaff', fontSize: '11px' } },
    series,
  })

  return <BaseHighchart options={options} height={height} />
}
