'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 시계열 데이터 (수위 m) */
  data: Array<[number, number]>
  /** AI 추천 운영 구간들 — 각 구간은 [startMs, endMs] */
  aiRecommendBands?: Array<{ from: number; to: number; label?: string }> | null
  title?: string
  height?: number
}

/**
 * 원본 성남정수장/components/aio/filter/chart/AILocationChart.vue 의
 * 시계열 + plotBand (AI 추천 운영 구간) 1:1 변환.
 */
export default function AILocationChart({
  data,
  aiRecommendBands = null,
  title = '여과지 수위 + AI 추천 구간',
  height = 260,
}: Props) {
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
              color: 'rgba(110,231,183,0.15)',
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
    legend: { enabled: false },
    series: [
      {
        type: 'spline',
        name: '수위',
        data,
        color: '#5cafff',
        lineWidth: 2,
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
