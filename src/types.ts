export type Product = {
  id: string
  brand: string
  name: string
  strengthMg: number | null
  pouchesPerCan: number
  price: number | null
  color: string
}

export type Can = {
  id: string
  productId: string
  openedAt: number
  finishedAt: number | null
}

export type Session = {
  id: string
  canId: string
  start: number
  end: number
}