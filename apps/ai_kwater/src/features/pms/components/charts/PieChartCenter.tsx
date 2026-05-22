'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

interface Props {
  /** 중앙 메인 값 (퍼센트) */
  value: number
  /** 중앙 라벨 */
  label?: string
  /** 색상 (active 부분) */
  color?: string
  /** 백그라운드 색 (idle 부분) */
  bgColor?: string
  height?: number
}

/**
 * 원본 성남정수장/components/pms/chart/dashboard/PieChart_center.vue —
 * 단일 값 도넛 (게이지 형태) + 중앙 강조 텍스트.
 */
export default function PieChartCenter({
  value,
  label,
  color = '#34d399',
  bgColor = 'rgba(92,175,255,0.15)',
  height = 200,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  const remainder = 100 - clamped

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'pie', height, marginTop: 8 },
    title: { text: undefined },
    legend: { enabled: false },
    tooltip: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '72%',
        borderWidth: 0,
        dataLabels: { enabled: false },
        startAngle: -90,
      },
    },
    series: [
      {
        type: 'pie',
        data: [
          { name: label ?? 'value', y: clamped, color },
          { name: 'idle', y: remainder, color: bgColor },
        ],
      },
    ],
    subtitle: {
      useHTML: true,
      text: `<div style="text-align:center;color:#ffffff;font-size:22px;font-weight:700;">${clamped.toFixed(0)}<span style="font-size:13px;color:#c3eaff;"> %</span></div>${
        label
          ? `<div style="text-align:center;color:#c3eaff;font-size:10px;margin-top:2px;">${label}</div>`
          : ''
      }`,
      floating: true,
      verticalAlign: 'middle',
      y: 6,
    },
  })

  return <BaseHighchart options={options} height={height} />
}
