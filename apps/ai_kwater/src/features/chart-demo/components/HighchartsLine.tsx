'use client'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const options: Highcharts.Options = {
  title: { text: '시간별 원수 탁도 (mock)' },
  xAxis: {
    categories: ['00', '03', '06', '09', '12', '15', '18', '21'],
    title: { text: '시간' },
  },
  yAxis: { title: { text: 'NTU' } },
  series: [
    {
      type: 'line',
      name: '원수 탁도',
      data: [3.1, 2.8, 2.6, 3.4, 4.2, 3.9, 3.3, 2.9],
      color: '#10b981',
    },
  ],
  credits: { enabled: false },
}

export default function HighchartsLine() {
  return <HighchartsReact highcharts={Highcharts} options={options} />
}
