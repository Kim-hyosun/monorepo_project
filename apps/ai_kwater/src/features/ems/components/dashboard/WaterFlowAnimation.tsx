'use client'

import { cn } from '@/shared/utils/cn'

/**
 * 원본 성남정수장/components/ems/dashboard/* waterway 1:1 복제 강화판.
 * - 평택4 → 배수지 송수관 6선 (메인 blue, 수평)
 * - 송산2 → 배수지 송수관 4선 (sub blue, 수평)
 * - DR/Peak 우회 적색 4선 (수평)
 * - 분기관 보조 blue 4선 (수평)
 * - 지선 4선 (수직/대각, 분기 노드 표현)
 * - 노드 dot LED (지점 접속부 시각화)
 */
interface HLine {
  top: string
  left: string
  width: string
  delay: string
  duration: string
}
interface BranchLine {
  /** percent 좌표 (0~100) */
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  delay: string
  duration: string
}
interface NodeDot {
  /** percent 좌표 */
  x: number
  y: number
  color: string
  delay: string
}

const RED_LINES: HLine[] = [
  { top: '12%', left: '18%', width: '22%', delay: '0s', duration: '4.6s' },
  { top: '32%', left: '42%', width: '28%', delay: '1.2s', duration: '5.1s' },
  { top: '58%', left: '8%', width: '34%', delay: '2.4s', duration: '4.4s' },
  { top: '78%', left: '52%', width: '22%', delay: '0.7s', duration: '5.0s' },
  { top: '88%', left: '20%', width: '18%', delay: '3.1s', duration: '4.8s' },
  { top: '22%', left: '60%', width: '20%', delay: '1.8s', duration: '4.7s' },
]
const BLUE_LINES: HLine[] = [
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

// 신규 — 지선 (수직/대각). SVG line으로 분기 노드 표현.
const BRANCH_LINES: BranchLine[] = [
  { x1: 54, y1: 8, x2: 54, y2: 28, color: '#5cafff', delay: '0.4s', duration: '3.2s' },
  { x1: 70, y1: 22, x2: 70, y2: 45, color: '#5cafff', delay: '1.6s', duration: '3.6s' },
  { x1: 42, y1: 32, x2: 42, y2: 60, color: '#ff6b6b', delay: '0.9s', duration: '3.4s' },
  { x1: 88, y1: 45, x2: 88, y2: 64, color: '#5cafff', delay: '2.2s', duration: '3.5s' },
]

const NODE_DOTS: NodeDot[] = [
  { x: 54, y: 8, color: '#5cafff', delay: '0s' },
  { x: 70, y: 15, color: '#5cafff', delay: '0.6s' },
  { x: 42, y: 32, color: '#ff6b6b', delay: '1.2s' },
  { x: 88, y: 45, color: '#5cafff', delay: '0.3s' },
  { x: 66, y: 60, color: '#5cafff', delay: '1.8s' },
  { x: 60, y: 22, color: '#5cafff', delay: '0.9s' },
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
        @keyframes wf-line-pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.85; }
        }
        @keyframes wf-dash {
          0% { stroke-dashoffset: 18; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes wf-node-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.6); opacity: 1; }
        }
      `}</style>

      {/* 수평 라인 — 기존 18선 (호출부 호환) */}
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

      {/* 지선 + 노드 — SVG overlay (분기점 시각화) */}
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
        className='absolute inset-0 h-full w-full'
        aria-hidden='true'
      >
        <defs>
          <marker
            id='wf-arrow-blue'
            viewBox='0 0 6 6'
            refX='5'
            refY='3'
            markerWidth='3'
            markerHeight='3'
            orient='auto'
          >
            <path d='M0,0 L6,3 L0,6 Z' fill='#5cafff' opacity='0.85' />
          </marker>
          <marker
            id='wf-arrow-red'
            viewBox='0 0 6 6'
            refX='5'
            refY='3'
            markerWidth='3'
            markerHeight='3'
            orient='auto'
          >
            <path d='M0,0 L6,3 L0,6 Z' fill='#ff6b6b' opacity='0.85' />
          </marker>
        </defs>
        {BRANCH_LINES.map((l, i) => (
          <line
            key={`branch-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.color}
            strokeWidth='0.4'
            strokeDasharray='1.5 1'
            strokeLinecap='round'
            markerEnd={l.color === '#ff6b6b' ? 'url(#wf-arrow-red)' : 'url(#wf-arrow-blue)'}
            opacity='0.7'
            style={{
              filter: `drop-shadow(0 0 1px ${l.color})`,
              animation: `wf-dash ${l.duration} linear ${l.delay} infinite, wf-line-pulse ${l.duration} ease-in-out ${l.delay} infinite`,
              transformBox: 'fill-box',
            }}
          />
        ))}
        {NODE_DOTS.map((n, i) => (
          <circle
            key={`node-${i}`}
            cx={n.x}
            cy={n.y}
            r='0.8'
            fill={n.color}
            opacity='0.9'
            style={{
              filter: `drop-shadow(0 0 2px ${n.color})`,
              transformOrigin: `${n.x}px ${n.y}px`,
              transformBox: 'fill-box',
              animation: `wf-node-pulse 2.4s ease-in-out ${n.delay} infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
