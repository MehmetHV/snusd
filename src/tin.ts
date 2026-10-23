export type Slot = { x: number; y: number }
export type Packing = { w: number; h: number; slots: Slot[] }

export function packPouches(n: number, radius: number): Packing {
  for (let h = radius / 3; h >= 6; h -= 0.5) {
    const w = h * 1.7
    const gap = h * 0.2
    const rowH = h + gap
    const rows = Math.floor((2 * radius) / rowH)
    const top = -(rows * rowH) / 2
    const slots: Slot[] = []
    for (let r = 0; r < rows; r++) {
      const y = top + rowH * (r + 0.5)
      const edge = Math.abs(y) + h / 2
      if (edge >= radius) continue
      const half = Math.sqrt(radius * radius - edge * edge)
      const count = Math.floor((2 * half + gap) / (w + gap))
      for (let c = 0; c < count; c++) {
        slots.push({ x: (c - (count - 1) / 2) * (w + gap), y })
      }
    }
    if (slots.length >= n) {
      const chosen = [...slots]
        .sort((a, b) => a.x ** 2 + a.y ** 2 - (b.x ** 2 + b.y ** 2))
        .slice(0, n)
        .sort((a, b) => a.y - b.y || a.x - b.x)
      return { w, h, slots: chosen }
    }
  }
  return { w: 6, h: 4, slots: [] }
}

export function mixHex(a: string, b: string, t: number): string {
  const k = Math.min(1, Math.max(0, t))
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const mixed = pa.map((v, i) => Math.round(v + (pb[i] - v) * k))
  return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}