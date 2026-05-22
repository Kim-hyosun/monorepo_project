import type { PmsAlert, ProcessStatus, PumpMotor } from '@/features/pms/types/pms'

const now = Date.now()

function trend(base: number, amp: number, seed: number): Array<[number, number]> {
  return Array.from({ length: 60 }, (_, i) => [
    now - (60 - i) * 60_000,
    +(base + Math.sin(i / 5 + seed) * amp + Math.random() * amp * 0.2).toFixed(2),
  ])
}

const CATEGORIES = [
  { prefix: '평택계통 송수펌프모터', count: 4, category: '송수' },
  { prefix: '안성계통 송수펌프모터', count: 4, category: '송수' },
  { prefix: '가압펌프', count: 3, category: '가압' },
  { prefix: '여과지 역세펌프', count: 3, category: '역세' },
  { prefix: '오존 송풍기', count: 2, category: '오존' },
  { prefix: 'GAC 가압펌프', count: 2, category: 'GAC' },
]

function generateMotors(): PumpMotor[] {
  const motors: PumpMotor[] = []
  let globalIdx = 0
  CATEGORIES.forEach((c, ci) => {
    for (let i = 0; i < c.count; i++) {
      globalIdx++
      const isError = globalIdx === 3 || globalIdx === 11
      const isWarning = globalIdx === 7
      const status = isError ? 'error' : isWarning ? 'warning' : 'normal'
      const ampBase = 12 + ci * 0.5
      motors.push({
        id: `motor_${String(globalIdx).padStart(2, '0')}`,
        index: globalIdx,
        name: `${c.prefix} #${i + 1}`,
        category: c.category,
        status,
        alarm: isError || isWarning,
        motor_de_amp_val: +(ampBase + Math.random() * 0.6).toFixed(2),
        motor_nde_amp_val: +(ampBase + 0.2 + Math.random() * 0.6).toFixed(2),
        pump_de_amp_val: +(ampBase + 0.4 + Math.random() * 0.6).toFixed(2),
        pump_nde_amp_val: +(ampBase + 0.6 + Math.random() * 0.6).toFixed(2),
        vibration_val: +(1.2 + Math.random() * 0.8 + (isError ? 2 : 0)).toFixed(2),
        temperature_val: +(45 + Math.random() * 6 + (isError ? 12 : 0)).toFixed(1),
        motor_de_amp: trend(ampBase, 0.8, globalIdx),
        motor_nde_amp: trend(ampBase + 0.2, 0.8, globalIdx + 0.5),
        pump_de_amp: trend(ampBase + 0.4, 0.8, globalIdx + 1),
        pump_nde_amp: trend(ampBase + 0.6, 0.8, globalIdx + 1.5),
        vibration: trend(1.5 + (isError ? 2 : 0), 0.3, globalIdx + 2),
        temperature: trend(45 + (isError ? 12 : 0), 1.5, globalIdx + 3),
      })
    }
  })
  return motors
}

export const seedMotors: PumpMotor[] = generateMotors()

/** 가변 큐 — mock handler 에서 push/markRead 가능 */
export const seedAlerts: PmsAlert[] = [
  {
    num: 1,
    time: '2026-05-20 14:25',
    list: '평택계통 송수펌프모터 #3',
    info: 'DE 진동',
    status: '경보',
    read: false,
  },
  {
    num: 2,
    time: '2026-05-20 14:10',
    list: '평택계통 송수펌프모터 #3',
    info: '온도 상승',
    status: '경보',
    read: false,
  },
  {
    num: 3,
    time: '2026-05-20 13:55',
    list: 'GAC 가압펌프 #1',
    info: '전류 이상',
    status: '주의',
    read: true,
  },
  {
    num: 4,
    time: '2026-05-20 12:30',
    list: '안성계통 송수펌프모터 #2',
    info: '점검 요청',
    status: '주의',
    read: true,
  },
  {
    num: 5,
    time: '2026-05-20 10:05',
    list: '오존 송풍기 #1',
    info: '주의',
    status: '주의',
    read: true,
  },
]

const ALERT_TEMPLATES = [
  { list: '평택계통 송수펌프모터 #1', info: 'DE 진동', status: '경보' },
  { list: '안성계통 송수펌프모터 #4', info: '온도 경고', status: '주의' },
  { list: 'GAC 가압펌프 #2', info: '전류 변동', status: '주의' },
  { list: '오존 송풍기 #2', info: 'NDE 진동', status: '경보' },
  { list: '여과지 역세펌프 #1', info: '베어링 마모 의심', status: '주의' },
]

let alertSeq = seedAlerts.length

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** mock handler 가 호출. 큐에 새 알람 1건 unshift. */
export function pushNewAlert(): PmsAlert {
  alertSeq += 1
  const t = ALERT_TEMPLATES[alertSeq % ALERT_TEMPLATES.length]
  const d = new Date()
  const alert: PmsAlert = {
    num: alertSeq,
    time: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
    list: t.list,
    info: t.info,
    status: t.status,
    read: false,
  }
  seedAlerts.unshift(alert)
  return alert
}

export function markAlertReadInMemory(num: number) {
  const found = seedAlerts.find((a) => a.num === num)
  if (found) found.read = true
}

export const seedProcess: ProcessStatus[] = [
  { index: 0, title: '착수', normal: 2, err: 0, img: 'icon1' },
  { index: 1, title: '약품', normal: 10, err: 0, img: 'icon2' },
  { index: 2, title: '혼화/응집', normal: 10, err: 0, img: 'icon3' },
  { index: 3, title: '침전', normal: 8, err: 0, img: 'icon4' },
  { index: 4, title: '여과', normal: 6, err: 1, img: 'icon5' },
  { index: 5, title: 'GAC여과', normal: 3, err: 0, img: 'icon6' },
  { index: 6, title: '소독', normal: 2, err: 0, img: 'icon7' },
  { index: 7, title: '송수', normal: 18, err: 2, img: 'icon8' },
]
