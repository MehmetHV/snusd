import type { Can, Product, Session } from './types'

const DAY = 24 * 60 * 60 * 1000

export const DAMP_MS = 30 * 60 * 1000

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
}

export function pouchesLeft(
  product: Product,
  can: Can,
  sessions: Session[],
  sessionActive: boolean,
): number {
  const used = sessions.filter((s) => s.canId === can.id).length + (sessionActive ? 1 : 0)
  return Math.max(0, product.pouchesPerCan - used)
}

export function estimate(
  left: number,
  can: Can,
  sessions: Session[],
  now: number,
): { perDay: number; daysLeft: number } | null {
  const mine = sessions.filter((s) => s.canId === can.id)
  if (mine.length < 3) return null
  const windowStart = Math.max(can.openedAt, now - 7 * DAY)
  const days = Math.max((now - windowStart) / DAY, 1)
  const recent = mine.filter((s) => s.start >= windowStart).length
  const perDay = recent / days
  if (perDay === 0) return null
  return { perDay, daysLeft: left / perDay }
}

export function todayCount(sessions: Session[], now: number): number {
  const today = new Date(now).toDateString()
  return sessions.filter((s) => new Date(s.start).toDateString() === today).length
}