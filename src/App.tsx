import { useEffect, useState } from 'react'
import ProductForm from './components/ProductForm'
import Pouch from './components/Pouch'
import Tin from './components/Tin'
import { usePersistentState } from './storage'
import { DAMP_MS, estimate, formatClock, pouchesLeft, todayCount } from './stats'
import type { Can, Product, Session } from './types'

const FALLBACK_LID = '#2447D6'

function productLabel(p: Product): string {
  const base = `${p.brand} ${p.name}`.trim()
  return p.strengthMg ? `${base}, ${p.strengthMg} mg` : base
}

export default function App() {
  const [products, setProducts] = usePersistentState<Product[]>('snusd:v2:products', [])
  const [cans, setCans] = usePersistentState<Can[]>('snusd:v2:cans', [])
  const [sessions, setSessions] = usePersistentState<Session[]>('snusd:v2:sessions', [])
  const [activeStart, setActiveStart] = usePersistentState<number | null>('snusd:v2:activeStart', null)
  const [adding, setAdding] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const currentCan = cans.find((c) => c.finishedAt === null)
  const currentProduct = currentCan
    ? products.find((p) => p.id === currentCan.productId)
    : undefined

  function addProduct(p: Product) {
    setProducts([...products, p])
    setAdding(false)
  }

  function removeProduct(id: string) {
    if (!window.confirm('Remove this product and everything logged on it?')) return
    const canIds = cans.filter((c) => c.productId === id).map((c) => c.id)
    setProducts(products.filter((p) => p.id !== id))
    setCans(cans.filter((c) => c.productId !== id))
    setSessions(sessions.filter((s) => !canIds.includes(s.canId)))
  }

  function openNewCan(productId: string) {
    setCans([
      ...cans,
      { id: crypto.randomUUID(), productId, openedAt: Date.now(), finishedAt: null },
    ])
  }

  function finishCan() {
    if (!currentCan) return
    setCans(cans.map((c) => (c.id === currentCan.id ? { ...c, finishedAt: Date.now() } : c)))
  }

  function discardCan() {
    if (!currentCan) return
    if (!window.confirm('Discard this can and everything logged on it?')) return
    setSessions(sessions.filter((s) => s.canId !== currentCan.id))
    setCans(cans.filter((c) => c.id !== currentCan.id))
    setActiveStart(null)
  }

  function start() {
    const t = Date.now()
    setNow(t)
    setActiveStart(t)
  }

  function stop() {
    if (activeStart === null || !currentCan) return
    setSessions([
      ...sessions,
      { id: crypto.randomUUID(), canId: currentCan.id, start: activeStart, end: Date.now() },
    ])
    setActiveStart(null)
  }

  if (products.length === 0 || adding) {
    return (
      <main className="screen">
        <div className="mark">snusD</div>
        <h2>What's on your shelf?</h2>
        <p className="soft">Add a can once. After that, opening it is one tap.</p>
        <ProductForm
          onSave={addProduct}
          onCancel={products.length > 0 ? () => setAdding(false) : undefined}
        />
      </main>
    )
  }

  if (!currentCan || !currentProduct) {
    return (
      <main className="screen">
        <div className="mark">snusD</div>
        <h2>Which can are you opening?</h2>
        <ul className="shelf">
          {products.map((p) => (
            <li key={p.id}>
              <button className="shelf-item" onClick={() => openNewCan(p.id)}>
                <span className="dot" style={{ background: p.color || FALLBACK_LID }} />
                {productLabel(p)}
              </button>
              <button
                className="remove"
                onClick={() => removeProduct(p.id)}
                aria-label={`Remove ${productLabel(p)}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button className="btn" onClick={() => setAdding(true)}>
          Add another to your shelf
        </button>
      </main>
    )
  }

  const running = activeStart !== null
  const elapsed = activeStart === null ? 0 : now - activeStart
  const capacity = currentProduct.pouchesPerCan
  const left = pouchesLeft(currentProduct, currentCan, sessions, running)
  const est = estimate(left, currentCan, sessions, now)

  return (
    <main className="screen">
      <div className="mark">snusD</div>

      <button
        className="tin-hit"
        onClick={start}
        disabled={running || left === 0}
        aria-label="Take one pouch"
      >
        <Tin
          capacity={capacity}
          left={left}
          color={currentProduct.color || FALLBACK_LID}
          turns={capacity - left}
        />
      </button>

      <div className="session">
        <Pouch active={running} damp={elapsed / DAMP_MS} />
        <p className={running ? 'clock' : 'clock idle'}>{formatClock(elapsed)}</p>
      </div>

      <div className="facts">
        <p>
          {left} of {capacity} left in {productLabel(currentProduct)}
        </p>
        {est && (
          <p className="soft">
            Lasts about {est.daysLeft.toFixed(1)} days at {est.perDay.toFixed(1)} a day
          </p>
        )}
        <p className="soft">{todayCount(sessions, now)} today</p>
      </div>

      <div className="actions">
        {running ? (
          <button className="btn main" onClick={stop}>Done</button>
        ) : (
          <button className="btn main" onClick={start} disabled={left === 0}>
            {left === 0 ? 'Can is empty' : 'Take one'}
          </button>
        )}
        {!running && (
          <button className="btn" onClick={finishCan}>Finish this can</button>
        )}
      </div>

      {!running && (
        <div className="actions">
          <button className="remove" onClick={discardCan}>Discard this can</button>
        </div>
      )}
    </main>
  )
}