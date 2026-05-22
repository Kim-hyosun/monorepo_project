'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { ChartCategoryValue } from '@/features/ems/types/ems'

interface Props {
  items: ChartCategoryValue[]
  height?: number
}

const PALETTE = [
  '#5cafff',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f87171',
  '#7dd3fc',
  '#fb923c',
  '#22d3ee',
]

function buildDrilldownSeries(
  items: ChartCategoryValue[],
  parentPath: string,
): Highcharts.SeriesPieOptions[] {
  const series: Highcharts.SeriesPieOptions[] = []
  items.forEach((parent) => {
    if (!parent.children || parent.children.length === 0) return
    const seriesId = parentPath ? `${parentPath}/${parent.name}` : parent.name
    series.push({
      type: 'pie',
      id: seriesId,
      name: parent.name,
      innerSize: '50%',
      data: parent.children.map((c, i) => ({
        name: c.name,
        y: c.value,
        color: PALETTE[i % PALETTE.length],
        drilldown: c.children && c.children.length > 0 ? `${seriesId}/${c.name}` : undefined,
      })),
    })
    series.push(...buildDrilldownSeries(parent.children, seriesId))
  })
  return series
}

export default function CategoryPieChart({ items, height = 220 }: Props) {
  const hasDrilldown = items.some((it) => it.children && it.children.length > 0)

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'pie', height },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: { color: '#c3eaff', fontSize: '10px' },
    },
    series: [
      {
        type: 'pie',
        innerSize: '50%',
        data: items.map((it, i) => ({
          name: it.name,
          y: it.value,
          color: PALETTE[i % PALETTE.length],
          drilldown: it.children && it.children.length > 0 ? it.name : undefined,
        })),
        showInLegend: true,
        dataLabels: { enabled: false },
      },
    ],
    drilldown: hasDrilldown
      ? {
          activeAxisLabelStyle: { color: '#5cafff', textDecoration: 'none' },
          activeDataLabelStyle: { color: '#5cafff', textDecoration: 'none' },
          breadcrumbs: {
            buttonTheme: {
              fill: 'rgba(0,6,77,0.6)',
              style: { color: '#c3eaff' },
              states: {
                hover: { fill: 'rgba(92,175,255,0.2)' },
                select: { fill: '#5cafff' },
              },
            },
            position: { align: 'left' },
          },
          series: buildDrilldownSeries(items, ''),
        }
      : undefined,
  })

  return <BaseHighchart options={options} height={height} />
}
