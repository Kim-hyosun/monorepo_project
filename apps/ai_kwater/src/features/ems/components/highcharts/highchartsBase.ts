import type Highcharts from 'highcharts'

/**
 * ai_kwater 공통 다크 테마 Highcharts options 부분 (spread 후 override).
 * - 배경 transparent (AioPanel 안에서 그려짐)
 * - axis/legend/tooltip 컬러: var(--aio-subtitle)·var(--aio-accent) 와 일치
 * - credits / accessibility / exporting 비활성
 */
export function baseDarkOptions(): Partial<Highcharts.Options> {
  return {
    chart: {
      backgroundColor: 'transparent',
      style: { color: '#c3eaff', fontFamily: 'inherit' },
    },
    title: { text: undefined },
    credits: { enabled: false },
    accessibility: { enabled: false },
    exporting: { enabled: false },
    legend: {
      itemStyle: { color: '#c3eaff', fontWeight: '500' },
      itemHoverStyle: { color: '#ffffff' },
      itemHiddenStyle: { color: '#445' },
    },
    tooltip: {
      backgroundColor: 'rgba(0,6,77,0.85)',
      borderColor: '#5cafff',
      style: { color: '#fff' },
    },
    plotOptions: {
      series: {
        animation: { duration: 200 },
        marker: { enabled: false, states: { hover: { enabled: true } } },
      },
      area: { fillOpacity: 0.4 },
      column: { borderWidth: 0 },
      pie: {
        borderWidth: 0,
        innerSize: '50%',
        dataLabels: { enabled: false },
      },
    },
    xAxis: {
      lineColor: '#5cafff88',
      tickColor: '#5cafff88',
      labels: { style: { color: '#c3eaff' } },
      gridLineColor: 'rgba(139, 194, 240, 0.1)',
    },
    yAxis: {
      gridLineColor: 'rgba(139, 194, 240, 0.1)',
      labels: { style: { color: '#c3eaff' } },
      title: { style: { color: '#c3eaff' } },
      lineColor: '#5cafff88',
    },
  }
}

/**
 * 두 옵션 객체를 얕은 병합 + xAxis/yAxis 깊이 1 병합. base 의 plotOptions 등은 spread 만 일어남.
 * 호출부에서 series / xAxis.categories / yAxis.title 등만 덮어쓰면 됨.
 */
export function mergeDark(
  base: Partial<Highcharts.Options>,
  override: Highcharts.Options,
): Highcharts.Options {
  return {
    ...base,
    ...override,
    chart: { ...base.chart, ...override.chart },
    legend: { ...base.legend, ...override.legend },
    tooltip: { ...base.tooltip, ...override.tooltip },
    plotOptions: { ...base.plotOptions, ...override.plotOptions },
  }
}
