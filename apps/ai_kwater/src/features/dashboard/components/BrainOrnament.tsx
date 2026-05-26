'use client'

/**
 * AI Brain 위에 rotating particle ring + dual aura glow.
 * Dashboard brain 3-layer(box_brain / ai_contents_line / ai_brain) 위 absolute overlay.
 *
 * 사용: brain wrapper의 `relative` 안에 `<BrainOrnament />` 마운트.
 */
const PARTICLE_COUNT = 8

export function BrainOrnament() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => i)
  return (
    <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
      <style>{`
        @keyframes brain-ring-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes brain-ring-rotate-rev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes brain-aura-breath {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes brain-aura-breath-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.14); opacity: 0.45; }
        }
        @keyframes brain-particle-fade {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Outer aura — 가장 큰 글로우 */}
      <div
        className='absolute inset-[-8%] rounded-full'
        style={{
          background:
            'radial-gradient(circle at center, rgba(92,175,255,0.45) 0%, rgba(92,175,255,0.18) 35%, transparent 65%)',
          animation: 'brain-aura-breath-slow 5.4s ease-in-out infinite',
          filter: 'blur(16px)',
        }}
      />
      {/* Inner aura — 중간 글로우 */}
      <div
        className='absolute inset-[6%] rounded-full'
        style={{
          background:
            'radial-gradient(circle at center, rgba(56,189,248,0.55) 0%, rgba(56,189,248,0.15) 45%, transparent 70%)',
          animation: 'brain-aura-breath 3.8s ease-in-out infinite',
          filter: 'blur(10px)',
        }}
      />

      {/* Rotating particle ring (outer) — 8 dot */}
      <svg
        viewBox='0 0 100 100'
        className='absolute inset-[3%] h-[94%] w-[94%]'
        style={{
          animation: 'brain-ring-rotate 22s linear infinite',
          transformOrigin: 'center',
        }}
      >
        {particles.map((i) => {
          const angle = (i / PARTICLE_COUNT) * 2 * Math.PI
          const cx = 50 + 47 * Math.cos(angle)
          const cy = 50 + 47 * Math.sin(angle)
          const delay = i * 0.25
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 2 === 0 ? 1.4 : 0.9}
              fill='#5cafff'
              style={{
                filter: 'drop-shadow(0 0 3px rgba(92,175,255,0.95))',
                transformBox: 'fill-box',
                animation: `brain-particle-fade 2.6s ease-in-out ${delay}s infinite`,
              }}
            />
          )
        })}
        {/* faint ring guide */}
        <circle
          cx='50'
          cy='50'
          r='47'
          fill='none'
          stroke='rgba(92,175,255,0.2)'
          strokeWidth='0.3'
          strokeDasharray='1 3'
        />
      </svg>

      {/* Inner counter-rotating thin ring */}
      <svg
        viewBox='0 0 100 100'
        className='absolute inset-[14%] h-[72%] w-[72%]'
        style={{
          animation: 'brain-ring-rotate-rev 14s linear infinite',
          transformOrigin: 'center',
        }}
      >
        <circle
          cx='50'
          cy='50'
          r='42'
          fill='none'
          stroke='rgba(56,189,248,0.35)'
          strokeWidth='0.4'
          strokeDasharray='6 3'
        />
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * 2 * Math.PI + Math.PI / 8
          const cx = 50 + 42 * Math.cos(angle)
          const cy = 50 + 42 * Math.sin(angle)
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r='1.1'
              fill='#38bdf8'
              style={{ filter: 'drop-shadow(0 0 2.5px rgba(56,189,248,0.9))' }}
            />
          )
        })}
      </svg>
    </div>
  )
}
