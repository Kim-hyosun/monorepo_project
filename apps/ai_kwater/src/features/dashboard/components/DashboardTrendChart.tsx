'use client'

import ReactECharts from 'echarts-for-react'

interface Props {
  data: Array<[number, number]>
  title: string
  yLabel?: string
}

/**
 * Dashboard 전용 다크 테마 트렌드 차트.
 * 일반 light 트렌드 차트는 features/receiving/components/TrendLineChart 사용.
 */
export default function DashboardTrendChart({ data, title, yLabel }: Props) {
  const option = {
    backgroundColor: 'transparent',
    title: { text: title, textStyle: { fontSize: 13, color: '#c3eaff' } },
    tooltip: { trigger: 'axis' as const, backgroundColor: 'rgba(0,6,77,0.85)', borderColor: '#5cafff', textStyle: { color: '#fff' } },
    grid: { left: 60, right: 30, top: 40, bottom: 30 },
    xAxis: {
      type: 'time' as const,
      axisLine: { lineStyle: { color: '#5cafff88' } },
      axisLabel: { color: '#c3eaff' },
      splitLine: { lineStyle: { color: 'rgba(139, 194, 240, 0.1)' } },
    },
    yAxis: {
      type: 'value' as const,
      name: yLabel,
      nameTextStyle: { color: '#c3eaff' },
      axisLine: { lineStyle: { color: '#5cafff88' } },
      axisLabel: { color: '#c3eaff' },
      splitLine: { lineStyle: { color: 'rgba(139, 194, 240, 0.1)' } },
    },
    series: [
      {
        type: 'line' as const,
        smooth: true,
        showSymbol: false,
        data,
        itemStyle: { color: '#5cafff' },
        lineStyle: { width: 2, shadowColor: '#5cafff', shadowBlur: 10 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(92, 175, 255, 0.4)' },
              { offset: 1, color: 'rgba(92, 175, 255, 0)' },
            ],
          },
        },
      },
    ],
  }
  return <ReactECharts option={option} style={{ height: 280, width: '100%' }} />
}
