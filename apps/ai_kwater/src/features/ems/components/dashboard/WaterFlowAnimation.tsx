'use client'

import { cn } from '@/shared/utils/cn'

/**
 * 원본 성남정수장/components/ems/dashboard/* waterway 18선 1:1 복제.
 * - 평택4 → 배수지 송수관 6선 (메인 blue)
 * - 송산2 → 배수지 송수관 4선 (sub blue)
 * - DR/Peak 우회 적색 4선
 * - 분기관 보조 blue 4선
 */
const RED_LINES = [
  { top: '12%', left: '18%', width: '22%', delay: '0s', duration: '4.6s' },
  { top: '32%', left: '42%', width: '28%', delay: '1.2s', duration: '5.1s' },
  { top: '58%', left: '8%', width: '34%', delay: '2.4s', duration: '4.4s' },
  { top: '78%', left: '52%', width: '22%', delay: '0.7s', duration: '5.0s' },
  { top: '88%', left: '20%', width: '18%', delay: '3.1s', duration: '4.8s' },
  { top: '22%', left: '60%', width: '20%', delay: '1.8s', duration: '4.7s' },
]
const BLUE_LINES = [
  // 메인 평택 6선
  { top: '8%', left: '8%', width: '46%', delay: '0s', duration: '6.2s' },
  { top: '18%', left: '28%', width: '54%', delay: '1.4s', duration: '6.5s' },
  { top: '28%', left: '6%', width: '60%', delay: '2.6s', duration: '6.0s' },
  { top: '38%', left: '20%', width: '52%', delay: '0.5s', duration: '6.4s' },
  { top: '48%', left: '12%', width: '64%', delay: '3.2s', duration: '6.1s' },
  { top: '60%', left: '32%', width: '50%', delay: '1.0s', duration: '6.6s' },
  // 송산 4선
  { top: '70%', left: '8%', width: '40%', delay: '2.1s', duration: '6.3s' },
  { top: '82%', left: '24%', width: '46%', delay: '0.8s', duration: '6.2s' },
  { top: '92%', left: '14%', width: '38%', delay: '3.6s', duration: '6.4s' },
  { top: '15%', left: '58%', width: '32%', delay: '1.7s', duration: '5.9s' },
  // 분기관 4선
  { top: '45%', left: '60%', width: '28%', delay: '2.8s', duration: '6.0s' },
  { top: '64%', left: '54%', width: '32%', delay: '0.3s', duration: '6.5s' },
]

export function WaterFlowAnimation({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <style>{`
        @keyframes wf-flow-red {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 0.75; }
          80% { opacity: 0.75; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes wf-flow-blue {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 0.55; }
          80% { opacity: 0.55; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
      {RED_LINES.map((l, i) => (
        <div
          key={`red-${i}`}
          className='absolute h-[2px]'
          style={{
            top: l.top,
            left: l.left,
            width: l.width,
            background: 'linear-gradient(90deg, transparent, #ff6b6b, transparent)',
            animation: `wf-flow-red ${l.duration} linear ${l.delay} infinite`,
            boxShadow: '0 0 6px rgba(255,107,107,0.6)',
          }}
        />
      ))}
      {BLUE_LINES.map((l, i) => (
        <div
          key={`blue-${i}`}
          className='absolute h-[2px]'
          style={{
            top: l.top,
            left: l.left,
            width: l.width,
            background: 'linear-gradient(90deg, transparent, #5cafff, transparent)',
            animation: `wf-flow-blue ${l.duration} linear ${l.delay} infinite`,
            boxShadow: '0 0 6px rgba(92,175,255,0.5)',
          }}
        />
      ))}
    </div>
  )
}
