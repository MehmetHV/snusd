import { mixHex } from '../tin'

type Props = { active: boolean; damp: number }

export default function Pouch({ active, damp }: Props) {
  return (
    <svg viewBox="0 0 120 72" className={active ? 'pouch in' : 'pouch'} aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="112"
        height="64"
        rx="30"
        fill={active ? mixHex('#F7F5EF', '#B08D57', damp) : 'none'}
        stroke={active ? '#8F7A55' : '#8A97A6'}
        strokeWidth="2.5"
        strokeDasharray={active ? undefined : '6 7'}
      />
    </svg>
  )
}