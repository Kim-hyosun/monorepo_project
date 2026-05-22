'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Slice {
  name: string
  value: number
  color?: string
}

interface Props {
  slices: Slice[]
  title?: string
  height?: number
  /** 도넛 내부 비율 ('0%' 면 일반 파이) */
  innerSize?: string
  /** 중앙 텍스트 (도넛일 때) */
  centerText?: string
}

const PALETTE = ['#34d399', '#5cafff', '#fbbf24', '#f87171', '#a78bfa', '#7dd3fc']

/**
 * 원본 성남정수장/components/pms/chart/dashboard/PieChart_main.vue —
 * 큰 도넛 차트 + 중앙 텍스트.
 */
export default function PieChartMain({
  slices,
  title,
  height = 260,
  innerSize = '60%',
  centerText,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'pie', height, marginTop: title ? 40 : 16 },
    title: title
      ? { text: title, style: { color: '#c3eaff', fontSize: '13px' }, align: 'left' }
      : { text: undefined },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: { color: '#c3eaff', fontSize: '11px' },
    },
    plotOptions: {
      pie: {
        innerSize,
        borderWidth: 0,
        dataLabels: { enabled: false },
      },
    },
    series: [
      {
        type: 'pie',
        data: slices.map((s, i) => ({
          name: s.name,
          y: s.value,
          color: s.color ?? PALETTE[i % PALETTE.length],
        })),
        showInLegend: true,
      },
    ],
    subtitle: centerText
      ? {
          useHTML: true,
          text: `<div style="color:#c3eaff;font-size:13px;text-align:center;">${centerText}</div>`,
          floating: true,
          verticalAlign: 'middle',
          y: 8,
        }
      : undefined,
  })

  return <BaseHighchart options={options} height={height} />
}
