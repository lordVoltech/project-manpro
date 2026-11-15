/**
 * Tiny in-process fake backend for the mock mode.
 *
 * It matches the contract in API_CONTRACT.md, including status codes,
 * envelopes, validation errors, and latency, so screens written against it
 * keep working when pointed at the real PHP API.
 */
import { ApiError } from '../errors'
import type {
  ApiErrorCode,
  AppSettings,
  Customer,
  CustomerProfile,
  DashboardSummary,
  ListResponse,
  LoginInput,
  PaymentStatus,
  ReportSummary,
  ServiceHistoryEntry,
  ShowroomUnit,
  StockStatus,
  TransactionQuery,
  UnitStatus,
  UpdatePaymentStatusInput,
  UpdateSettingsInput,
  UpdateUnitStatusInput,
  UpdateWorkOrderStatusInput,
  WorkOrder,
  WorkOrderStatus,
} from '../types'
import { MOCK_PASSWORD, seedUsers } from './data'
import { resetStore, store } from './store'

export type QueryParams = Record<string, string>

type MockContext = {
  params: string[]
  query: QueryParams
  body: unknown
}

type MockMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type Route = {
  method: MockMethod
  pattern: RegExp
  handler: (context: MockContext) => unknown
}

const LATENCY_MS = 250

const WORK_ORDER_STATUSES: WorkOrderStatus[] = [
  'menunggu',
  'inspeksi',
  'dikerjakan',
  'selesai',
]
const UNIT_STATUSES: UnitStatus[] = ['tersedia', 'reserved', 'terjual']
const PAYMENT_STATUSES: PaymentStatus[] = ['lunas', 'belum_lunas']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fail(
  status: number,
  code: ApiErrorCode,
  message: string,
  fieldErrors?: Record<string, string>,
): never {
  throw new ApiError(status, {
    code,
    message,
    ...(fieldErrors ? { field_errors: fieldErrors } : {}),
  })
}

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS)
  })
}

function bodyObject(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fail(400, 'validation_failed', 'Body harus berupa objek JSON.')
  }

  return body as Record<string, unknown>
}

function readString(body: Record<string, unknown>, key: string): string {
  const value = body[key]
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(body: Record<string, unknown>, key: string): number | null {
  const value = body[key]
  if (value === undefined || value === null || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function paginate<T>(rows: T[], query: QueryParams): ListResponse<T> {
  const page = Math.max(1, Number(query.page ?? 1) || 1)
  const perPage = Math.min(
    100,
    Math.max(1, Number(query.per_page ?? 20) || 20),
  )
  const start = (page - 1) * perPage

  return {
    data: rows.slice(start, start + perPage),
    meta: {
      page,
      per_page: perPage,
      total: rows.length,
      total_pages: Math.max(1, Math.ceil(rows.length / perPage)),
    },
  }
}

function searchTerm(query: QueryParams): string {
  return (query.q ?? '').trim().toLowerCase()
}

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle)
}

function nowIso(): string {
  return new Date().toISOString()
}

function dateOnly(iso: string): string {
  return iso.slice(0, 10)
}

/**
 * The mock treats the latest transaction date as "today", so the seed data
 * always looks current regardless of the real clock.
 */
function referenceDate(): string {
  const latest = store.transactions.reduce<string | null>(
    (max, transaction) =>
      !max || transaction.occurred_at > max ? transaction.occurred_at : max,
    null,
  )

  return dateOnly(latest ?? nowIso())
}

function nextId(sequence: keyof typeof store.sequences, prefix: string, pad: number) {
  const value = store.sequences[sequence]
  store.sequences[sequence] = value + 1
  return `${prefix}${String(value).padStart(pad, '0')}`
}

function deriveStockStatus(stockQty: number, minQty: number): StockStatus {
  if (stockQty <= 0) return 'habis'
  if (stockQty < minQty) return 'menipis'
  return 'aman'
}

function requireUser() {
  const user = store.session.user
  if (!user) {
    fail(401, 'unauthorized', 'Sesi berakhir. Silakan masuk kembali.')
  }
  return user
}

function findWorkOrder(id: string): WorkOrder {
  const order = store.workOrders.find((item) => item.id === id)
  if (!order) fail(404, 'not_found', `Work order ${id} tidak ditemukan.`)
  return order
}

function findUnit(id: string): ShowroomUnit {
  const unit = store.units.find((item) => item.id === id)
  if (!unit) fail(404, 'not_found', `Unit ${id} tidak ditemukan.`)
  return unit
}

function findCustomer(id: string): Customer {
  const customer = store.customers.find((item) => item.id === id)
  if (!customer) fail(404, 'not_found', `Pelanggan ${id} tidak ditemukan.`)
  return customer
}

function buildCustomerProfile(customer: Customer): CustomerProfile {
  const openOrders: ServiceHistoryEntry[] = store.workOrders
    .filter((order) => order.customer.id === customer.id && order.status !== 'selesai')
    .map((order) => ({
      id: `HIS-${order.id}`,
      occurred_at: order.created_at,
      description: order.complaint,
      total: order.estimate_total,
      status: 'berlangsung',
    }))

  const closedTransactions: ServiceHistoryEntry[] = store.transactions
    .filter((transaction) => transaction.customer.id === customer.id)
    .map((transaction) => ({
      id: `HIS-${transaction.id}`,
      occurred_at: transaction.occurred_at,
      description: transaction.items.map((item) => item.description).join(', '),
      total: transaction.total,
      status: 'selesai',
    }))

  const history = [...openOrders, ...closedTransactions].sort((left, right) =>
    right.occurred_at.localeCompare(left.occurred_at),
  )

  return { ...customer, history }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const routes: Route[] = [
  // Session -----------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/session$/,
    handler: () => ({ data: store.session }),
  },
  {
    method: 'POST',
    pattern: /^\/session\/login$/,
    handler: ({ body }) => {
      const input = bodyObject(body) as Partial<LoginInput>
      const email = typeof input.email === 'string' ? input.email.trim() : ''
      const password = typeof input.password === 'string' ? input.password : ''

      const fieldErrors: Record<string, string> = {}
      if (!email) fieldErrors.email = 'Email wajib diisi.'
      if (!password) fieldErrors.password = 'Kata sandi wajib diisi.'
      if (Object.keys(fieldErrors).length > 0) {
        fail(422, 'validation_failed', 'Email dan kata sandi wajib diisi.', fieldErrors)
      }

      const user = seedUsers.find(
        (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
      )
      if (!user || password !== MOCK_PASSWORD) {
        fail(401, 'unauthorized', 'Email atau kata sandi salah.')
      }
      if (!user.is_active) {
        fail(403, 'forbidden', 'Akun ini sedang nonaktif.')
      }

      store.session.user = user
      return { data: store.session }
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/session$/,
    handler: () => {
      store.session.user = null
      return { data: null }
    },
  },

  // Work orders -------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/work-orders$/,
    handler: ({ query }) => {
      requireUser()
      const status = query.status as WorkOrderStatus | undefined
      const term = searchTerm(query)

      let rows = [...store.workOrders].sort((left, right) =>
        right.created_at.localeCompare(left.created_at),
      )

      if (status) {
        if (!WORK_ORDER_STATUSES.includes(status)) {
          fail(422, 'validation_failed', 'Status work order tidak dikenal.', {
            status: 'Nilai status tidak valid.',
          })
        }
        rows = rows.filter((order) => order.status === status)
      }

      if (term) {
        rows = rows.filter((order) =>
          matches(
            [
              order.id,
              order.customer.name,
              order.vehicle.model_name,
              order.vehicle.plate_number,
              order.complaint,
              order.mechanic_name ?? '',
            ].join(' '),
            term,
          ),
        )
      }

      return paginate(rows, query)
    },
  },
  {
    method: 'POST',
    pattern: /^\/work-orders$/,
    handler: ({ body }) => {
      requireUser()
      const input = bodyObject(body)
      const customerName = readString(input, 'customer_name')
      const vehicleName = readString(input, 'vehicle_name')
      const estimateAmount = readNumber(input, 'estimate_amount') ?? 0

      const fieldErrors: Record<string, string> = {}
      if (!customerName) fieldErrors.customer_name = 'Nama pelanggan wajib diisi.'
      if (!vehicleName) fieldErrors.vehicle_name = 'Nama motor wajib diisi.'
      if (estimateAmount < 0) {
        fieldErrors.estimate_amount = 'Estimasi tidak boleh negatif.'
      }
      if (Object.keys(fieldErrors).length > 0) {
        fail(422, 'validation_failed', 'Data work order belum lengkap.', fieldErrors)
      }

      const timestamp = nowIso()
      const phone = readString(input, 'phone') || '-'
      const plateNumber = readString(input, 'plate_number').toUpperCase() || '-'
      const customerId = readString(input, 'customer_id')

      let customer = customerId
        ? store.customers.find((item) => item.id === customerId)
        : store.customers.find(
            (item) => item.name.toLowerCase() === customerName.toLowerCase(),
          )

      if (!customer) {
        customer = {
          id: nextId('customer', 'CUS-', 3),
          name: customerName,
          phone,
          email: null,
          address: null,
          member_since: dateOnly(timestamp),
          tag: 'Baru',
          total_spend: 0,
          last_visit_at: timestamp,
          vehicles: [],
        }
        store.customers.unshift(customer)
      }
      customer.last_visit_at = timestamp

      let vehicle = customer.vehicles.find(
        (item) =>
          item.plate_number.toLowerCase() === plateNumber.toLowerCase() ||
          item.model_name.toLowerCase() === vehicleName.toLowerCase(),
      )

      if (!vehicle) {
        vehicle = {
          id: nextId('vehicle', 'VEH-', 3),
          customer_id: customer.id,
          model_name: vehicleName,
          plate_number: plateNumber,
          year: Number(timestamp.slice(0, 4)),
          color: null,
          last_service_at: null,
          last_service_note: null,
        }
        customer.vehicles.push(vehicle)
      }

      const mechanicName = readString(input, 'mechanic_name') || null
      const complaint = readString(input, 'complaint') || 'Tanpa catatan keluhan.'

      const order: WorkOrder = {
        id: nextId('workOrder', 'WO-2026-', 3),
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
        },
        vehicle: {
          id: vehicle.id,
          model_name: vehicle.model_name,
          plate_number: vehicle.plate_number,
        },
        complaint,
        mechanic_name: mechanicName,
        status: 'menunggu',
        estimate_total: estimateAmount,
        created_at: timestamp,
        completed_at: null,
        notes: 'Dibuat dari formulir (mock).',
        items:
          estimateAmount > 0
            ? [
                {
                  id: nextId('workOrderItem', 'WOI-', 4),
                  kind: 'jasa',
                  description: 'Estimasi awal pekerjaan',
                  qty: 1,
                  unit_price: estimateAmount,
                  subtotal: estimateAmount,
                },
              ]
            : [],
        timeline: [
          { status: 'menunggu', at: timestamp, note: 'Work order dibuat' },
        ],
      }

      store.workOrders.unshift(order)
      return { data: order }
    },
  },
  {
    method: 'GET',
    pattern: /^\/work-orders\/([^/]+)$/,
    handler: ({ params }) => {
      requireUser()
      return { data: findWorkOrder(params[0]) }
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/work-orders\/([^/]+)\/status$/,
    handler: ({ params, body }) => {
      requireUser()
      const order = findWorkOrder(params[0])
      const input = bodyObject(body) as Partial<UpdateWorkOrderStatusInput>
      const status = input.status

      if (!status || !WORK_ORDER_STATUSES.includes(status)) {
        fail(422, 'validation_failed', 'Status work order tidak valid.', {
          status: 'Pilih salah satu status yang tersedia.',
        })
      }

      if (order.status !== status) {
        order.status = status
        if (status === 'selesai') order.completed_at = nowIso()
        order.timeline.push({
          status,
          at: nowIso(),
          note: typeof input.note === 'string' ? input.note : null,
        })
      }

      return { data: order }
    },
  },

  // Showroom ----------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/showroom\/units$/,
    handler: ({ query }) => {
      requireUser()
      const status = query.status as UnitStatus | undefined
      const term = searchTerm(query)

      let rows = [...store.units].sort((left, right) =>
        left.id.localeCompare(right.id),
      )

      if (status) {
        if (!UNIT_STATUSES.includes(status)) {
          fail(422, 'validation_failed', 'Status unit tidak dikenal.', {
            status: 'Nilai status tidak valid.',
          })
        }
        rows = rows.filter((unit) => unit.status === status)
      }

      if (term) {
        rows = rows.filter((unit) =>
          matches(
            [unit.id, unit.model_name, unit.plate_number, unit.location].join(
              ' ',
            ),
            term,
          ),
        )
      }

      return paginate(rows, query)
    },
  },
  {
    method: 'GET',
    pattern: /^\/showroom\/units\/([^/]+)$/,
    handler: ({ params }) => {
      requireUser()
      return { data: findUnit(params[0]) }
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/showroom\/units\/([^/]+)$/,
    handler: ({ params, body }) => {
      requireUser()
      const unit = findUnit(params[0])
      const input = bodyObject(body) as Partial<UpdateUnitStatusInput>
      const status = input.status

      if (!status || !UNIT_STATUSES.includes(status)) {
        fail(422, 'validation_failed', 'Status unit tidak valid.', {
          status: 'Pilih salah satu status yang tersedia.',
        })
      }

      if (status === 'terjual' && unit.status !== 'terjual') {
        fail(
          409,
          'conflict',
          'Penjualan unit harus lewat transaksi agar stok dan laporan konsisten.',
        )
      }

      unit.status = status
      return { data: unit }
    },
  },

  // Transactions ------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/transactions$/,
    handler: ({ query }) => {
      requireUser()
      const type = query.type as TransactionQuery['type']
      const status = query.status as PaymentStatus | undefined
      const term = searchTerm(query)

      let rows = [...store.transactions].sort((left, right) =>
        right.occurred_at.localeCompare(left.occurred_at),
      )

      if (type) rows = rows.filter((row) => row.type === type)
      if (status) rows = rows.filter((row) => row.status === status)
      if (term) {
        rows = rows.filter((row) =>
          matches(
            [row.id, row.customer.name, row.payment_method, row.type].join(' '),
            term,
          ),
        )
      }

      return paginate(rows, query)
    },
  },
  {
    method: 'GET',
    pattern: /^\/transactions\/([^/]+)$/,
    handler: ({ params }) => {
      requireUser()
      const transaction = store.transactions.find(
        (item) => item.id === params[0],
      )
      if (!transaction) {
        fail(404, 'not_found', `Transaksi ${params[0]} tidak ditemukan.`)
      }
      return { data: transaction }
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/transactions\/([^/]+)\/payment$/,
    handler: ({ params, body }) => {
      requireUser()
      const transaction = store.transactions.find(
        (item) => item.id === params[0],
      )
      if (!transaction) {
        fail(404, 'not_found', `Transaksi ${params[0]} tidak ditemukan.`)
      }

      const input = bodyObject(body) as Partial<UpdatePaymentStatusInput>
      const status = input.status
      if (!status || !PAYMENT_STATUSES.includes(status)) {
        fail(422, 'validation_failed', 'Status pembayaran tidak valid.', {
          status: 'Gunakan "lunas" atau "belum_lunas".',
        })
      }

      transaction.status = status
      return { data: transaction }
    },
  },

  // Customers ---------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/customers$/,
    handler: ({ query }) => {
      requireUser()
      const term = searchTerm(query)

      let rows = [...store.customers].sort((left, right) =>
        left.name.localeCompare(right.name),
      )

      if (query.has_vehicle === 'true') {
        rows = rows.filter((customer) => customer.vehicles.length > 0)
      }

      if (term) {
        rows = rows.filter((customer) =>
          matches(
            [
              customer.name,
              customer.phone,
              customer.email ?? '',
              customer.address ?? '',
              ...customer.vehicles.map(
                (vehicle) => `${vehicle.model_name} ${vehicle.plate_number}`,
              ),
            ].join(' '),
            term,
          ),
        )
      }

      return paginate(rows, query)
    },
  },
  {
    method: 'GET',
    pattern: /^\/customers\/([^/]+)$/,
    handler: ({ params }) => {
      requireUser()
      return { data: buildCustomerProfile(findCustomer(params[0])) }
    },
  },

  // Stock -------------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/stock\/parts$/,
    handler: ({ query }) => {
      requireUser()
      const status = query.status as StockStatus | undefined
      const category = query.category
      const term = searchTerm(query)

      let rows = store.parts.map((part) => ({
        ...part,
        status: deriveStockStatus(part.stock_qty, part.min_qty),
      }))

      if (status) rows = rows.filter((part) => part.status === status)
      if (category) rows = rows.filter((part) => part.category === category)
      if (term) {
        rows = rows.filter((part) =>
          matches([part.name, part.sku, part.category].join(' '), term),
        )
      }

      rows.sort((left, right) => left.stock_qty - right.stock_qty)
      return paginate(rows, query)
    },
  },
  {
    method: 'GET',
    pattern: /^\/stock\/movements$/,
    handler: ({ query }) => {
      requireUser()
      const rows = [...store.movements].sort((left, right) =>
        right.occurred_at.localeCompare(left.occurred_at),
      )
      return paginate(rows, query)
    },
  },

  // Insights ----------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/dashboard\/summary$/,
    handler: () => {
      requireUser()
      const today = referenceDate()
      const todaysTransactions = store.transactions.filter(
        (transaction) => dateOnly(transaction.occurred_at) === today,
      )

      const workOrders: Record<WorkOrderStatus, number> = {
        menunggu: 0,
        inspeksi: 0,
        dikerjakan: 0,
        selesai: 0,
      }
      for (const order of store.workOrders) workOrders[order.status] += 1

      const summary: DashboardSummary = {
        revenue_today: todaysTransactions
          .filter((transaction) => transaction.status === 'lunas')
          .reduce((total, transaction) => total + transaction.total, 0),
        transaction_count_today: todaysTransactions.length,
        pending_payment_count: store.transactions.filter(
          (transaction) => transaction.status === 'belum_lunas',
        ).length,
        work_orders: workOrders,
        units_available: store.units.filter((unit) => unit.status === 'tersedia')
          .length,
        low_stock_count: store.parts.filter(
          (part) => deriveStockStatus(part.stock_qty, part.min_qty) !== 'aman',
        ).length,
        sales_week: store.salesWeek,
      }

      return { data: summary }
    },
  },
  {
    method: 'GET',
    pattern: /^\/reports\/summary$/,
    handler: ({ query }) => {
      requireUser()
      const month = referenceDate().slice(0, 7)
      const from = query.from ?? `${month}-01`
      const to = query.to ?? `${month}-31`

      const rows = store.transactions.filter((transaction) => {
        const date = dateOnly(transaction.occurred_at)
        return date >= from && date <= to
      })

      const paid = rows.filter((transaction) => transaction.status === 'lunas')
      const totals = new Map<string, { customer: Customer; total: number }>()
      for (const transaction of paid) {
        const current = totals.get(transaction.customer.id)
        if (current) {
          current.total += transaction.total
        } else {
          totals.set(transaction.customer.id, {
            customer: store.customers.find(
              (item) => item.id === transaction.customer.id,
            ) ?? {
              id: transaction.customer.id,
              name: transaction.customer.name,
              phone: transaction.customer.phone,
              email: null,
              address: null,
              member_since: dateOnly(transaction.occurred_at),
              tag: null,
              total_spend: 0,
              last_visit_at: null,
              vehicles: [],
            },
            total: transaction.total,
          })
        }
      }

      const summary: ReportSummary = {
        range: { from, to },
        revenue: paid.reduce((total, transaction) => total + transaction.total, 0),
        transaction_count: rows.length,
        service_revenue: paid
          .filter((transaction) => transaction.type === 'servis')
          .reduce((total, transaction) => total + transaction.total, 0),
        parts_revenue: paid
          .filter((transaction) => transaction.type === 'barang')
          .reduce((total, transaction) => total + transaction.total, 0),
        units_sold: paid.filter((transaction) => transaction.type === 'motor')
          .length,
        top_customers: [...totals.values()]
          .sort((left, right) => right.total - left.total)
          .slice(0, 5)
          .map((entry) => ({
            customer: {
              id: entry.customer.id,
              name: entry.customer.name,
              phone: entry.customer.phone,
            },
            total_spend: entry.total,
          })),
      }

      return { data: summary }
    },
  },

  // Settings ----------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/settings$/,
    handler: () => {
      requireUser()
      return { data: store.settings }
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/settings$/,
    handler: ({ body }) => {
      requireUser()
      const input = bodyObject(body) as UpdateSettingsInput
      const current: AppSettings = store.settings

      if (input.business) {
        for (const [key, value] of Object.entries(input.business)) {
          if (typeof value !== 'string') continue
          if (!(key in current.business)) continue
          current.business[key as keyof typeof current.business] = value
        }
      }

      if (Array.isArray(input.payment_methods)) {
        for (const update of input.payment_methods) {
          const method = current.payment_methods.find(
            (item) => item.key === update.key,
          )
          if (!method) {
            fail(422, 'validation_failed', 'Metode pembayaran tidak dikenal.', {
              payment_methods: update.key,
            })
          }
          method.is_active = Boolean(update.is_active)
        }
      }

      if (Array.isArray(input.preferences)) {
        for (const update of input.preferences) {
          const preference = current.preferences.find(
            (item) => item.key === update.key,
          )
          if (!preference) {
            fail(422, 'validation_failed', 'Preferensi tidak dikenal.', {
              preferences: update.key,
            })
          }
          preference.is_enabled = Boolean(update.is_enabled)
        }
      }

      return { data: current }
    },
  },

  // Mock utilities ----------------------------------------------------------
  {
    method: 'POST',
    pattern: /^\/mock\/reset$/,
    handler: () => {
      resetStore()
      return { data: store.session }
    },
  },
]

/**
 * Resolve a request against the fake backend. Throws ApiError for non-2xx,
 * exactly like the real HTTP client does.
 */
export async function handleMockRequest<T>(
  method: MockMethod,
  path: string,
  query: QueryParams,
  body: unknown,
): Promise<T> {
  await delay()

  const route = routes.find(
    (candidate) => candidate.method === method && candidate.pattern.test(path),
  )
  if (!route) {
    fail(404, 'not_found', `Endpoint ${method} ${path} tidak tersedia di mock.`)
  }

  const match = route.pattern.exec(path)
  const result = route.handler({
    params: match ? match.slice(1) : [],
    query,
    body,
  })

  return structuredClone(result) as T
}
