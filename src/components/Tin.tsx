import { useMemo } from 'react'
import { packPouches } from '../tin'

type Props = {
  capacity: number
  left: number
  color: string
  turns: number
}

export default function Tin({ capacity, left, color, turns }: Props) {
  const { w, h, slots } = useMemo(() => packPouches(capacity, 126), [capacity])

  return (
    <svg
      viewBox="-160 -160 320 320"
      className="tin"
      role="img"
      aria-label={`${left} of ${capacity} pouches left`}
    >
      <defs>
        <radialGradient id="tin-inside">
          <stop offset="0.55" stopColor="#223044" />
          <stop offset="1" stopColor="#101826" />
        </radialGradient>
      </defs>
      <circle r="156" fill={color} />
      <circle r="156" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" />
      <circle r="136" fill="url(#tin-inside)" />
      <circle r="136" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="3" />
      <g className="tin-spin" style={{ transform: `rotate(${turns * 53}deg)` }}>
        {slots.map((s, i) => {
          const filled = i >= capacity - left
          return (
            <rect
              key={i}
              x={s.x - w / 2}
              y={s.y - h / 2}
              width={w}
              height={h}
              rx={h * 0.42}
              fill={filled ? '#F7F5EF' : 'rgba(255,255,255,0.06)'}
              stroke={filled ? '#CFC9BA' : 'none'}
              strokeWidth="1"
            />
          )
        })}
      </g>
    </svg>
  )
}