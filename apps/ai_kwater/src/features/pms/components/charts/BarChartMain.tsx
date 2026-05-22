'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { ProcessStatus } from '@/features/pms/types/pms'

interface Props {
  process: ProcessStatus[]
  /** 선택된 공정 index (값이 있으면 해당 카테고리만 강조) */
  selectedIndex?: number | null
  height?: number
  onSelect?: (index: number) => void
}

/**
 * 원본 성남정수장/components/pms/chart/dashboard/BarChart_main.vue (39줄) 의
 * 공정별 normal/err pair stacked column 1:1.
 * - normal = 정상 (emerald), err = 경보 (rose)
 * - click 시 onSelect(index) — 원본 selectBarchart 와 동등
 */
export default function BarChartMain({
  process,
  selectedIndex = null,
  height = 220,
  onSelect,
}: Props) {
  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'column', height, marginTop: 30 },
    xAxis: {
      type: 'category',
      categories: process.map((p) => p.title),
      labels: { style: { color: '#c3eaff', fontSize: '10px' } },
    },
    yAxis: { title: { text: undefined }, min: 0 },
    legend: {
      itemStyle: { color: '#c3eaff', fontSize: '10px' },
      align: 'left',
      verticalAlign: 'top',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        events: onSelect
          ? {
              click(this: unknown, e: Highcharts.SeriesClickEventObject) {
                if (typeof e.point.x === 'number') onSelect(e.point.x)
              },
            }
          : undefined,
      },
      series: {
        cursor: onSelect ? 'pointer' : 'default',
      },
    },
    series: [
      {
        type: 'column',
        name: '정상',
        data: process.map((p, i) => ({
          y: p.normal,
          color: selectedIndex === i ? '#34d399' : '#34d39988',
        })),
      },
      {
        type: 'column',
        name: '경보',
        data: process.map((p, i) => ({
          y: p.err,
          color: selectedIndex === i ? '#f87171' : '#f8717188',
        })),
      },
    ],
  })

  return <BaseHighchart options={options} height={height} />
}
