/**
 * API contract — shared data shapes between frontend and backend.
 *
 * Conventions (see API_CONTRACT.md for the full document):
 * - Money is an integer number of rupiah. Never a formatted string, never a float.
 * - Timestamps are ISO 8601 (e.g. "2026-11-09T09:15:00+07:00"); dates are "YYYY-MM-DD".
 * - The backend is the source of truth. The UI only displays and formats.
 * - Machine values are lowercase snake_case; Indonesian labels are a UI concern.
 */

// ---------------------------------------------------------------------------
// Transport primitives
// ---------------------------------------------------------------------------

export type ISODateTime = string
export type ISODate = string
/** Integer rupiah, no decimals. 185000 means Rp 185.000. */
export type Rupiah = number

export type ApiErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation_failed'
  | 'conflict'
  | 'server_error'

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode
    message: string
    /** Field name -> human readable message, used to mark form inputs. */
    field_errors?: Record<string, string>
  }
}

export type PaginationMeta = {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export type ListResponse<T> = {
  data: T[]
  meta: PaginationMeta
}

export type ItemResponse<T> = {
  data: T
}

export type ListQuery = {
  page?: number
  per_page?: number
  /** Free text search. */
  q?: string
}

// ---------------------------------------------------------------------------
// Identity and access
// ---------------------------------------------------------------------------

export type Role = 'owner' | 'mekanik' | 'kasir'

/** Permission keys are checked by the backend on every sensitive action. */
export type Permission =
  | 'dashboard.read'
  | 'workorder.read'
  | 'workorder.create'
  | 'workorder.update_status'
  | 'showroom.read'
  | 'showroom.manage'
  | 'stock.read'
  | 'stock.manage'
  | 'transaction.read'
  | 'transaction.create'
  | 'transaction.pay'
  | 'customer.read'
  | 'customer.manage'
  | 'report.read'
  | 'settings.read'
  | 'settings.manage'
  | 'user.manage'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  permissions: Permission[]
  is_active: boolean
}

/** Session is cookie based; the browser never stores a password or token. */
export type Session = {
  /** Null means not authenticated; the UI should redirect to the login screen. */
  user: User | null
}

export type LoginInput = {
  email: string
  password: string
}

// ---------------------------------------------------------------------------
// Customers and vehicles
// ---------------------------------------------------------------------------

export type CustomerSummary = {
  id: string
  name: string
  phone: string
}

export type VehicleSummary = {
  id: string
  model_name: string
  plate_number: string
}

export type Vehicle = {
  id: string
  customer_id: string
  model_name: string
  plate_number: string
  year: number
  color: string | null
  last_service_at: ISODateTime | null
  last_service_note: string | null
}

export type Customer = {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  member_since: ISODate
  /** Free label such as "Pelanggan setia". Null when there is no tag. */
  tag: string | null
  total_spend: Rupiah
  last_visit_at: ISODateTime | null
  vehicles: Vehicle[]
}

export type ServiceHistoryEntry = {
  id: string
  occurred_at: ISODateTime
  description: string
  total: Rupiah
  /** "selesai" for closed work, "berlangsung" while still in progress. */
  status: 'selesai' | 'berlangsung'
}

export type CustomerProfile = Customer & {
  history: ServiceHistoryEntry[]
}

export type CustomerQuery = ListQuery & {
  /** Search also matches vehicle plate numbers. */
  has_vehicle?: boolean
}

// ---------------------------------------------------------------------------
// Workshop / work orders
// ---------------------------------------------------------------------------

/** Machine values. Display labels live in the UI. */
export type WorkOrderStatus = 'menunggu' | 'inspeksi' | 'dikerjakan' | 'selesai'

export type WorkOrderItemKind = 'jasa' | 'part'

export type WorkOrderItem = {
  id: string
  kind: WorkOrderItemKind
  description: string
  qty: number
  unit_price: Rupiah
  subtotal: Rupiah
}

export type WorkOrderEvent = {
  status: WorkOrderStatus
  at: ISODateTime
  note: string | null
}

export type WorkOrder = {
  id: string
  customer: CustomerSummary
  vehicle: VehicleSummary
  complaint: string
  mechanic_name: string | null
  status: WorkOrderStatus
  estimate_total: Rupiah
  created_at: ISODateTime
  completed_at: ISODateTime | null
  notes: string | null
  items: WorkOrderItem[]
  /** Append only, oldest first. The last entry is the current state. */
  timeline: WorkOrderEvent[]
}

export type WorkOrderQuery = ListQuery & {
  status?: WorkOrderStatus
}

export type CreateWorkOrderInput = {
  /** Existing customer, if picked from the customer list. */
  customer_id?: string
  customer_name: string
  phone?: string
  vehicle_name: string
  plate_number?: string
  complaint?: string
  mechanic_name?: string
  estimate_amount?: Rupiah
}

export type UpdateWorkOrderStatusInput = {
  status: WorkOrderStatus
  note?: string
}

// ---------------------------------------------------------------------------
// Showroom units
// ---------------------------------------------------------------------------

export type UnitStatus = 'tersedia' | 'reserved' | 'terjual'

export type ShowroomUnit = {
  id: string
  model_name: string
  year: number
  plate_number: string
  price: Rupiah
  status: UnitStatus
  mileage_km: number
  fuel_type: string
  location: string
  color: string
  engine_cc: number
  /** End of the current road tax period. */
  tax_valid_until: ISODate
  notes: string | null
  listed_at: ISODateTime
}

export type UnitQuery = ListQuery & {
  status?: UnitStatus
}

export type UpdateUnitStatusInput = {
  status: UnitStatus
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export type TransactionType = 'servis' | 'barang' | 'motor'
export type PaymentMethod = 'tunai' | 'transfer' | 'qris' | 'kartu'
export type PaymentStatus = 'lunas' | 'belum_lunas'

export type TransactionItem = {
  id: string
  description: string
  qty: number
  unit_price: Rupiah
  subtotal: Rupiah
}

export type Transaction = {
  id: string
  occurred_at: ISODateTime
  customer: CustomerSummary
  type: TransactionType
  payment_method: PaymentMethod
  total: Rupiah
  status: PaymentStatus
  cashier_name: string
  items: TransactionItem[]
}

export type TransactionQuery = ListQuery & {
  type?: TransactionType
  status?: PaymentStatus
}

export type UpdatePaymentStatusInput = {
  status: PaymentStatus
}

// ---------------------------------------------------------------------------
// Stock
// ---------------------------------------------------------------------------

/** Derived by the backend from stock_qty vs min_qty. Never trusted from the client. */
export type StockStatus = 'aman' | 'menipis' | 'habis'

export type Part = {
  sku: string
  name: string
  category: string
  stock_qty: number
  min_qty: number
  /** Weighted average cost, integer rupiah. Owner-only data. */
  average_cost: Rupiah
  sale_price: Rupiah
  status: StockStatus
}

export type PartQuery = ListQuery & {
  status?: StockStatus
  category?: string
}

export type StockMovementType = 'in' | 'out' | 'adjustment'

export type StockMovement = {
  id: string
  part_sku: string
  part_name: string
  type: StockMovementType
  /** Always positive. Direction comes from `type`. */
  qty: number
  /** Source document, e.g. "WO-2026-012" or "PO-2026-004". */
  reference: string | null
  occurred_at: ISODateTime
  note: string | null
}

// ---------------------------------------------------------------------------
// Dashboard and reports
// ---------------------------------------------------------------------------

export type SalesPoint = {
  date: ISODate
  amount: Rupiah
}

export type DashboardSummary = {
  revenue_today: Rupiah
  transaction_count_today: number
  pending_payment_count: number
  work_orders: Record<WorkOrderStatus, number>
  units_available: number
  low_stock_count: number
  sales_week: SalesPoint[]
}

export type DateRangeQuery = {
  from?: ISODate
  to?: ISODate
}

export type ReportSummary = {
  range: {
    from: ISODate
    to: ISODate
  }
  revenue: Rupiah
  transaction_count: number
  service_revenue: Rupiah
  parts_revenue: Rupiah
  units_sold: number
  top_customers: Array<{
    customer: CustomerSummary
    total_spend: Rupiah
  }>
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export type BusinessProfile = {
  name: string
  phone: string
  email: string
  address: string
  operating_hours: string
}

export type PaymentMethodSetting = {
  key: PaymentMethod
  label: string
  description: string
  is_active: boolean
}

export type PreferenceKey =
  | 'low_stock_alert'
  | 'daily_summary'
  | 'auto_print_receipt'

export type PreferenceSetting = {
  key: PreferenceKey
  label: string
  description: string
  is_enabled: boolean
}

export type AppSettings = {
  business: BusinessProfile
  payment_methods: PaymentMethodSetting[]
  preferences: PreferenceSetting[]
}

export type UpdateSettingsInput = {
  business?: Partial<BusinessProfile>
  payment_methods?: Array<Pick<PaymentMethodSetting, 'key' | 'is_active'>>
  preferences?: Array<Pick<PreferenceSetting, 'key' | 'is_enabled'>>
}
