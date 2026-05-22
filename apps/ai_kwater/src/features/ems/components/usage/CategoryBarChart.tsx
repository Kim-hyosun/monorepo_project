'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { ChartCategoryValue } from '@/features/ems/types/ems'

interface Props {
  items: ChartCategoryValue[]
  height?: number
  yLabel?: string
}

const DEPTH_COLORS = ['#5cafff', '#34d399', '#fbbf24']

function buildDrilldownSeries(
  items: ChartCategoryValue[],
  parentPath: string,
  depth: number,
): Highcharts.SeriesColumnOptions[] {
  const series: Highcharts.SeriesColumnOptions[] = []
  const color = DEPTH_COLORS[depth % DEPTH_COLORS.length]
  items.forEach((parent) => {
    if (!parent.children || parent.children.length === 0) return
    const seriesId = parentPath ? `${parentPath}/${parent.name}` : parent.name
    series.push({
      type: 'column',
      id: seriesId,
      name: parent.name,
      color,
      data: parent.children.map((c) => ({
        name: c.name,
        y: c.value,
        drilldown: c.children && c.children.length > 0 ? `${seriesId}/${c.name}` : undefined,
      })),
    })
    series.push(...buildDrilldownSeries(parent.children, seriesId, depth + 1))
  })
  return series
}

export default function CategoryBarChart({ items, height = 220, yLabel }: Props) {
  const hasDrilldown = items.some((it) => it.children && it.children.length > 0)

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'column', height },
    xAxis: {
      type: 'category',
      labels: {
        style: { color: '#c3eaff', fontSize: '10px' },
        rotation: -25,
      },
    },
    yAxis: { title: { text: yLabel } },
    legend: { enabled: false },
    series: [
      {
        type: 'column',
        name: yLabel ?? '값',
        color: DEPTH_COLORS[0],
        data: items.map((it) => ({
          name: it.name,
          y: it.value,
          drilldown: it.children && it.children.length > 0 ? it.name : undefined,
        })),
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
          series: buildDrilldownSeries(items, '', 1),
        }
      : undefined,
  })

  return <BaseHighchart options={options} height={height} />
}
