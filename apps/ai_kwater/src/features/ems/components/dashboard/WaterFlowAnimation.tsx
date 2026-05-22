'use client'

import { cn } from '@/shared/utils/cn'

const RED_LINES = [
  { top: '15%', left: '20%', width: '20%', delay: '0s' },
  { top: '40%', left: '45%', width: '25%', delay: '1.2s' },
  { top: '65%', left: '15%', width: '30%', delay: '2.4s' },
  { top: '80%', left: '55%', width: '18%', delay: '0.6s' },
]
const BLUE_LINES = [
  { top: '25%', left: '30%', width: '40%', delay: '0s' },
  { top: '50%', left: '10%', width: '35%', delay: '1.8s' },
  { top: '70%', left: '40%', width: '45%', delay: '3.0s' },
  { top: '90%', left: '20%', width: '30%', delay: '0.9s' },
  { top: '10%', left: '50%', width: '28%', delay: '2.1s' },
]

export function WaterFlowAnimation({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <style>{`
        @keyframes wf-flow-red {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes wf-flow-blue {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
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
            animation: `wf-flow-red 5s linear ${l.delay} infinite`,
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
            animation: `wf-flow-blue 6s linear ${l.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
