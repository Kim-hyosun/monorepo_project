// 원본: 성남정수장/src/store/aio/modules/common.js 의 공정 라우팅/타임스탬프 계산 헬퍼.

import type { useRouter } from 'next/navigation'

type AppRouter = ReturnType<typeof useRouter>

export interface RoutingByIndexCtx {
  router: AppRouter
  setMainMenuIndex?: (index: number) => void
  setDisinfectionIndex?: (index: number) => void
  emsServiceUrl?: string
}

/**
 * 원본 $routingByIndex — 공정 index 로 라우팅.
 * Vue prototype + Vuex 직접 mutate 였던 부분을 호출부가 ctx 로 dependency 주입하도록 변경.
 * 8 (송수) 의 경우 EMS 서비스 URL 로 window.open 하는 동작은 원본 유지.
 */
export function routingByIndex(ctx: RoutingByIndexCtx, index: number): void {
  const { router, setMainMenuIndex, setDisinfectionIndex, emsServiceUrl } = ctx
  switch (index) {
    case 0:
      setMainMenuIndex?.(0)
      router.push('/')
      return
    case 1:
      setMainMenuIndex?.(2)
      router.push('/receivingAlgorithm')
      return
    case 2:
      setMainMenuIndex?.(2)
      router.push('/cgAlgorithm')
      return
    case 2.1:
      setMainMenuIndex?.(2)
      router.push('/cgAlgorithmS')
      return
    case 3:
      setMainMenuIndex?.(2)
      router.push('/mtccAlgorithm')
      return
    case 3.1:
      setMainMenuIndex?.(2)
      router.push('/MtccAlgorithmS')
      return
    case 4:
      setMainMenuIndex?.(2)
      router.push('/sedimentationAlgorithm')
      return
    case 5:
      setMainMenuIndex?.(2)
      router.push('/filterAlgorithm')
      return
    case 6:
      setMainMenuIndex?.(2)
      router.push('/gacAlgorithm')
      return
    case 7:
      setMainMenuIndex?.(2)
      router.push('/disinfectionAlgorithm')
      return
    case 7.1:
      setDisinfectionIndex?.(1)
      setMainMenuIndex?.(2)
      router.push('/disinfectionAlgorithm')
      return
    case 7.2:
      setDisinfectionIndex?.(2)
      setMainMenuIndex?.(2)
      router.push('/disinfectionAlgorithm')
      return
    case 7.3:
      setDisinfectionIndex?.(3)
      setMainMenuIndex?.(2)
      router.push('/disinfectionAlgorithm')
      return
    case 8:
      setMainMenuIndex?.(8)
      if (typeof window !== 'undefined' && emsServiceUrl) {
        window.open(`${emsServiceUrl}/analysis`, '_self')
      }
      return
    case 11:
      setMainMenuIndex?.(2)
      router.push('/ozoneAlgorithm')
      return
  }
}

type ScheduleEntry = { start: string | number | null; end?: string | number | null; next_end?: string | number | null }

/**
 * 원본 $getMinMaxTimestampAIFLocationSchedule.
 * 여과/GAC 차트의 x축 min/max. (start / next_end / end 기준)
 */
export function getMinMaxTimestampAIFLocationSchedule(
  obj: Record<string, ScheduleEntry>,
): [number, number] {
  let min = 0
  let max = 0
  for (const key of Object.keys(obj)) {
    const e = obj[key]
    if (e.start !== '0' && e.start !== null) {
      const t = new Date(e.start as string | number).getTime()
      if (min === 0 || t < min) min = t
    }
    if (e.next_end && e.next_end !== '0') {
      const t = new Date(e.next_end as string | number).getTime()
      if (max === 0 || t > max) max = t
    } else if (e.end && e.end !== '0') {
      const t = new Date(e.end as string | number).getTime()
      if (max === 0 || t > max) max = t
    }
  }
  return [min, max]
}

type AIESchedule = { start: string | null; stop?: string | null; inbal?: string | null }

/**
 * 원본 $getMinMaxTimestampAIELocationSchedule.
 * 침전(e_sc2_schedule ~ e_sc9_schedule) min/max.
 */
export function getMinMaxTimestampAIELocationSchedule(
  obj: Record<string, AIESchedule>,
): [number, number] {
  let min = 0
  let max = 0
  for (let i = 2; i < 10; i++) {
    const e = obj[`e_sc${i}_schedule`]
    if (!e) continue
    if (e.start && e.start !== '0') {
      const t = new Date(e.start).getTime()
      if (min === 0 || t < min) min = t
    }
    if (e.stop && e.stop !== '0') {
      const t = new Date(e.stop).getTime()
      if (max === 0 || t > max) max = t
    }
    if (e.inbal && e.inbal !== '0') {
      const t = new Date(e.inbal).getTime()
      if (max === 0 || t > max) max = t
    }
  }
  return [min, max]
}
