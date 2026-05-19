'use client'

import ReactECharts from 'echarts-for-react'

const option = {
  title: { text: '월별 정수처리량 (mock)' },
  tooltip: { trigger: 'axis' as const },
  xAxis: {
    type: 'category' as const,
    data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  },
  yAxis: { type: 'value' as const },
  series: [
    {
      type: 'bar' as const,
      data: [120, 200, 150, 80, 70, 110, 130, 180, 220, 190, 160, 140],
      itemStyle: { color: '#3b82f6' },
    },
  ],
}

export default function EChartsBars() {
  return <ReactECharts option={option} style={{ height: 360, width: '100%' }} />
}
