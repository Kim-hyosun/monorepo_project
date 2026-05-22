'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'

export type ScatterCategory = 'Normal' | 'Warning' | 'Critical' | 'Fault'

export interface ScatterPoint {
  /** 유량 ㎥/min */
  flow: number
  /** 압력 kgf/cm² */
  pressure: number
  category: ScatterCategory
}

interface Props {
  points: ScatterPoint[]
  height?: number
  /** 현재 운영 포인트 (강조 표시) */
  current?: { flow: number; pressure: number; color?: string } | null
}

/**
 * 원본 성남정수장/components/pms/chart/monitoring/Scatter_PTK.vue (528줄) 의
 * Health Feature Space scatter 1:1 옵션.
 * - 4 카테고리 (Normal / Warning / Critical / Fault) 시리즈
 * - x = 유량(㎥/min), y = 압력(kgf/cm²)
 * - current 포인트 별도 큰 marker 로 강조
 */
const CATEGORY_COLOR: Record<ScatterCategory, string> = {
  Normal: '#5cafff',
  Warning: '#fbbf24',
  Critical: '#fb923c',
  Fault: '#ef4444',
}

const CATEGORIES: ScatterCategory[] = ['Normal', 'Warning', 'Critical', 'Fault']

export default function ScatterPTK({ points, height = 320, current }: Props) {
  const seriesByCategory: Highcharts.SeriesScatterOptions[] = CATEGORIES.map((cat) => ({
    type: 'scatter',
    name: cat,
    color: CATEGORY_COLOR[cat],
    data: points.filter((p) => p.category === cat).map((p) => [p.flow, p.pressure]),
    marker: { radius: 4, symbol: 'circle' },
  }))

  if (current) {
    seriesByCategory.push({
      type: 'scatter',
      name: '현재 운영',
      color: current.color ?? '#ffffff',
      data: [[current.flow, current.pressure]],
      marker: { radius: 8, symbol: 'diamond', lineWidth: 2, lineColor: '#fff' },
    })
  }

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { height, marginTop: 48 },
    title: {
      text: 'Health Feature Space',
      align: 'center',
      style: { color: '#c3eaff', fontSize: '13px' },
    },
    xAxis: {
      title: { text: '유량 (㎥/min)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      title: { text: '압력 (kgf/cm²)', style: { color: '#5D96C4' } },
      gridLineDashStyle: 'Dash',
    },
    legend: {
      itemStyle: { color: '#c3eaff', fontSize: '11px' },
      align: 'right',
      verticalAlign: 'top',
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '유량 {point.x:.1f} / 압력 {point.y:.2f}',
    },
    series: seriesByCategory,
  })

  return <BaseHighchart options={options} height={height} />
}
