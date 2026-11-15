/**
 * In-memory store for the mock backend. Mutations persist for the lifetime of
 * the page (or the test process), then reset on reload.
 */
import type {
  AppSettings,
  Customer,
  Part,
  Session,
  ShowroomUnit,
  StockMovement,
  Transaction,
  WorkOrder,
} from '../types'
import {
  seedCustomers,
  seedMovements,
  seedParts,
  seedSalesWeek,
  seedSettings,
  seedTransactions,
  seedUnits,
  seedUsers,
  seedWorkOrders,
} from './data'

type Store = {
  session: Session
  customers: Customer[]
  workOrders: WorkOrder[]
  units: ShowroomUnit[]
  transactions: Transaction[]
  parts: Part[]
  movements: StockMovement[]
  settings: AppSettings
  salesWeek: Array<{ date: string; amount: number }>
  sequences: {
    workOrder: number
    workOrderItem: number
    transaction: number
    movement: number
    customer: number
    vehicle: number
  }
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function freshSession(): Session {
  const user = seedUsers[0]
  return { user: clone(user) }
}

export const store: Store = {
  session: freshSession(),
  customers: clone(seedCustomers),
  workOrders: clone(seedWorkOrders),
  units: clone(seedUnits),
  transactions: clone(seedTransactions),
  parts: clone(seedParts),
  movements: clone(seedMovements),
  settings: clone(seedSettings),
  salesWeek: clone(seedSalesWeek),
  sequences: {
    workOrder: 15,
    workOrderItem: 1_000,
    transaction: 119,
    movement: 32,
    customer: 7,
    vehicle: 8,
  },
}

/** Restore the seed data. Used by tests and the mock reset endpoint. */
export function resetStore(): void {
  store.session = freshSession()
  store.customers = clone(seedCustomers)
  store.workOrders = clone(seedWorkOrders)
  store.units = clone(seedUnits)
  store.transactions = clone(seedTransactions)
  store.parts = clone(seedParts)
  store.movements = clone(seedMovements)
  store.settings = clone(seedSettings)
  store.salesWeek = clone(seedSalesWeek)
  store.sequences = {
    workOrder: 15,
    workOrderItem: 1_000,
    transaction: 119,
    movement: 32,
    customer: 7,
    vehicle: 8,
  }
}
