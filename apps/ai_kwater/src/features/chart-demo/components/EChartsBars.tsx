'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'

const options: Highcharts.Options = {
  chart: { type: 'column', height: 360, marginTop: 50, backgroundColor: 'transparent' },
  credits: { enabled: false },
  accessibility: { enabled: false },
  exporting: { enabled: false },
  title: { text: '월별 정수처리량 (mock)', align: 'left', style: { fontSize: '14px' } },
  legend: { enabled: false },
  tooltip: { shared: true },
  xAxis: {
    type: 'category',
    categories: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
  },
  yAxis: { title: { text: undefined } },
  plotOptions: { series: { animation: { duration: 200 } }, column: { borderWidth: 0 } },
  series: [
    {
      type: 'column',
      name: '정수처리량',
      data: [120, 200, 150, 80, 70, 110, 130, 180, 220, 190, 160, 140],
      color: '#3b82f6',
    },
  ],
}

export default function EChartsBars() {
  return <BaseHighchart options={options} height={360} />
}
