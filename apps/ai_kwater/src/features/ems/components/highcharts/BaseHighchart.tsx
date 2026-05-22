'use client'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

interface Props {
  options: Highcharts.Options
  height?: number
}

export default function BaseHighchart({ options, height }: Props) {
  const merged: Highcharts.Options = height
    ? { ...options, chart: { ...options.chart, height } }
    : options
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={merged}
      containerProps={{ style: { width: '100%', height: height ? `${height}px` : '100%' } }}
    />
  )
}
