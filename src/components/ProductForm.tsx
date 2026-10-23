import { useState, type FormEvent } from 'react'
import type { Product } from '../types'

const LIDS = [
  { name: 'blue', hex: '#2447D6' },
  { name: 'red', hex: '#D63B2A' },
  { name: 'green', hex: '#1E8F6E' },
  { name: 'yellow', hex: '#F0B429' },
  { name: 'violet', hex: '#7B4FD4' },
  { name: 'graphite', hex: '#3A4450' },
]

type Props = {
  onSave: (product: Product) => void
  onCancel?: () => void
}

export default function ProductForm({ onSave, onCancel }: Props) {
  const [brand, setBrand] = useState('')
  const [name, setName] = useState('')
  const [strength, setStrength] = useState('')
  const [pouches, setPouches] = useState('20')
  const [price, setPrice] = useState('')
  const [color, setColor] = useState(LIDS[0].hex)

  function submit(e: FormEvent) {
    e.preventDefault()
    const pouchCount = Number(pouches)
    if (!brand.trim() || !(pouchCount > 0)) return
    onSave({
      id: crypto.randomUUID(),
      brand: brand.trim(),
      name: name.trim(),
      strengthMg: Number(strength) > 0 ? Number(strength) : null,
      pouchesPerCan: pouchCount,
      price: Number(price) > 0 ? Number(price) : null,
      color,
    })
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Brand
        <input value={brand} onChange={(e) => setBrand(e.target.value)} autoComplete="off" />
      </label>
      <label>
        Flavor
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
      </label>
      <label>
        Strength in mg (optional)
        <input inputMode="decimal" value={strength} onChange={(e) => setStrength(e.target.value)} />
      </label>
      <label>
        Pouches per can
        <input inputMode="numeric" value={pouches} onChange={(e) => setPouches(e.target.value)} />
      </label>
      <label>
        Price per can (optional)
        <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <fieldset className="lids">
        <legend>Lid color</legend>
        <div>
          {LIDS.map((l) => (
            <button
              key={l.hex}
              type="button"
              className="swatch"
              aria-label={l.name}
              aria-pressed={color === l.hex}
              style={{ background: l.hex }}
              onClick={() => setColor(l.hex)}
            />
          ))}
        </div>
      </fieldset>
      <div className="actions">
        <button className="btn main" type="submit">Add to shelf</button>
        {onCancel && (
          <button className="btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}