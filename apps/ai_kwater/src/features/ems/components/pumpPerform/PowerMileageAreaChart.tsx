'use client'

import type Highcharts from 'highcharts'

import BaseHighchart from '@/features/ems/components/highcharts/BaseHighchart'
import { baseDarkOptions, mergeDark } from '@/features/ems/components/highcharts/highchartsBase'
import type { PumpPerformData } from '@/features/ems/types/ems'

interface Props {
  data: PumpPerformData
  height?: number
}

export default function PowerMileageAreaChart({ data, height = 220 }: Props) {
  const toPoints = (values: number[]): Array<[number, number]> =>
    values.map((v, i) => [data.startMs + i * data.intervalMs, v])

  const options: Highcharts.Options = mergeDark(baseDarkOptions(), {
    chart: { type: 'area', height, marginTop: 70 },
    xAxis: { type: 'datetime', labels: { format: '{value:%m-%d}' } },
    yAxis: { title: { text: 'kWh' } },
    plotOptions: {
      area: { stacking: 'normal', fillOpacity: 0.55, marker: { enabled: false } },
    },
    series: data.powerMileage.map<Highcharts.SeriesAreaOptions>((s) => ({
      type: 'area',
      name: s.name,
      data: toPoints(s.data),
      color: s.color,
      lineWidth: 1,
    })),
  })

  return <BaseHighchart options={options} height={height} enableRangeSelector enableExport />
}
