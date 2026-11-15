import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Wrench,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  EmptyState,
  FilterChips,
  Notice,
  PageHeader,
  SearchField,
  StatCard,
  type BadgeTone,
} from '../components/ui'
import { formatClock, formatRupiah } from '../lib/format'

type OrderStatus = 'Menunggu' | 'Inspeksi' | 'Dikerjakan' | 'Selesai'

type OrderItem = {
  name: string
  qty: string
  price: string
}

type TimelineStep = {
  label: string
  time: string
  done: boolean
}

type Order = {
  id: string
  customer: string
  phone: string
  vehicle: string
  plate: string
  complaint: string
  mechanic: string
  status: OrderStatus
  time: string
  estimate: string
  items: OrderItem[]
  notes: string
  timeline: TimelineStep[]
}

const statusTone: Record<OrderStatus, BadgeTone> = {
  Menunggu: 'neutral',
  Inspeksi: 'info',
  Dikerjakan: 'warning',
  Selesai: 'success',
}

const filters: Array<OrderStatus | 'Semua'> = [
  'Semua',
  'Menunggu',
  'Inspeksi',
  'Dikerjakan',
  'Selesai',
]

const initialOrders: Order[] = [
  {
    id: 'WO-2026-014',
    customer: 'Budi Santoso',
    phone: '0812-3456-7890',
    vehicle: 'Honda Beat',
    plate: 'B 1234 XYZ',
    complaint: 'Servis rutin, ganti oli, rem depan terasa blong',
    mechanic: 'Slamet',
    status: 'Dikerjakan',
    time: 'Masuk 09.15',
    estimate: 'Rp 185.000',
    items: [
      { name: 'Jasa servis rutin', qty: '1', price: 'Rp 100.000' },
      { name: 'Oli Yamalube 10W-40', qty: '1', price: 'Rp 48.000' },
      { name: 'Kampas rem depan', qty: '1', price: 'Rp 37.000' },
    ],
    notes: 'Pelanggan menunggu di tempat.',
    timeline: [
      { label: 'Work order dibuat', time: '09.15', done: true },
      { label: 'Inspeksi', time: '09.20', done: true },
      { label: 'Dikerjakan', time: '09.30', done: true },
      { label: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'WO-2026-013',
    customer: 'Siti Aminah',
    phone: '0857-1122-3344',
    vehicle: 'Yamaha NMAX',
    plate: 'D 5678 ABC',
    complaint: 'CVT berisik saat digas, getaran terasa di kaki',
    mechanic: 'Joko',
    status: 'Inspeksi',
    time: 'Masuk 09.40',
    estimate: 'Rp 320.000',
    items: [
      { name: 'Jasa inspeksi CVT', qty: '1', price: 'Rp 50.000' },
      { name: 'V-Belt NMAX Original', qty: '1', price: 'Rp 135.000' },
      { name: 'Roller CVT', qty: '1 set', price: 'Rp 135.000' },
    ],
    notes: 'Menunggu konfirmasi pelanggan untuk penggantian V-Belt.',
    timeline: [
      { label: 'Work order dibuat', time: '09.40', done: true },
      { label: 'Inspeksi', time: '09.45', done: true },
      { label: 'Dikerjakan', time: '-', done: false },
      { label: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'WO-2026-012',
    customer: 'Rudi Hartono',
    phone: '0813-9988-7766',
    vehicle: 'Honda Vario 125',
    plate: 'F 9021 KL',
    complaint: 'Ganti kampas rem belakang dan setel rem',
    mechanic: 'Slamet',
    status: 'Dikerjakan',
    time: 'Masuk 08.20',
    estimate: 'Rp 145.000',
    items: [
      { name: 'Jasa ganti kampas rem', qty: '1', price: 'Rp 50.000' },
      { name: 'Kampas rem belakang', qty: '1', price: 'Rp 65.000' },
      { name: 'Setel rem', qty: '1', price: 'Rp 30.000' },
    ],
    notes: 'Sparepart sudah tersedia di gudang.',
    timeline: [
      { label: 'Work order dibuat', time: '08.20', done: true },
      { label: 'Inspeksi', time: '08.25', done: true },
      { label: 'Dikerjakan', time: '08.40', done: true },
      { label: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'WO-2026-011',
    customer: 'Dewi Lestari',
    phone: '0821-4455-6677',
    vehicle: 'Yamaha Aerox',
    plate: 'B 4455 QQ',
    complaint: 'Servis besar 20.000 km, cek seluruh bagian',
    mechanic: 'Joko',
    status: 'Dikerjakan',
    time: 'Masuk 08.05',
    estimate: 'Rp 540.000',
    items: [
      { name: 'Jasa servis besar', qty: '1', price: 'Rp 300.000' },
      { name: 'Oli Yamalube 10W-40', qty: '1', price: 'Rp 48.000' },
      { name: 'Busi NGK CPR9', qty: '1', price: 'Rp 22.000' },
      { name: 'Filter udara', qty: '1', price: 'Rp 38.000' },
      { name: 'Kampas rem belakang', qty: '1', price: 'Rp 65.000' },
      { name: 'Rantai keteng', qty: '1', price: 'Rp 67.000' },
    ],
    notes: 'Servis besar, estimasi selesai sore ini.',
    timeline: [
      { label: 'Work order dibuat', time: '08.05', done: true },
      { label: 'Inspeksi', time: '08.15', done: true },
      { label: 'Dikerjakan', time: '08.30', done: true },
      { label: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'WO-2026-010',
    customer: 'Agus Setiawan',
    phone: '0819-2233-4455',
    vehicle: 'Honda Scoopy',
    plate: 'B 7788 TT',
    complaint: 'Motor sulit dinyalakan pagi hari',
    mechanic: 'Bayu',
    status: 'Menunggu',
    time: 'Masuk 07.50',
    estimate: 'Rp 95.000',
    items: [
      { name: 'Jasa pemeriksaan', qty: '1', price: 'Rp 50.000' },
      { name: 'Busi NGK CPR9', qty: '1', price: 'Rp 22.000' },
      { name: 'Setel karburator', qty: '1', price: 'Rp 23.000' },
    ],
    notes: 'Belum masuk meja mekanik.',
    timeline: [
      { label: 'Work order dibuat', time: '07.50', done: true },
      { label: 'Inspeksi', time: '-', done: false },
      { label: 'Dikerjakan', time: '-', done: false },
      { label: 'Selesai', time: '-', done: false },
    ],
  },
  {
    id: 'WO-2026-009',
    customer: 'Nina Kartika',
    phone: '0838-6677-8899',
    vehicle: 'Yamaha Mio',
    plate: 'B 3322 RR',
    complaint: 'Ganti oli dan cek tekanan angin',
    mechanic: 'Slamet',
    status: 'Selesai',
    time: 'Selesai 08.45',
    estimate: 'Rp 75.000',
    items: [
      { name: 'Jasa servis ringan', qty: '1', price: 'Rp 30.000' },
      { name: 'Oli Yamalube 10W-40', qty: '1', price: 'Rp 45.000' },
    ],
    notes: 'Sudah diserahkan ke pelanggan.',
    timeline: [
      { label: 'Work order dibuat', time: '07.30', done: true },
      { label: 'Inspeksi', time: '07.40', done: true },
      { label: 'Dikerjakan', time: '08.00', done: true },
      { label: 'Selesai', time: '08.45', done: true },
    ],
  },
]

const mechanicLoad = [
  { name: 'Slamet', active: 3, capacity: 5 },
  { name: 'Joko', active: 2, capacity: 4 },
  { name: 'Bayu', active: 1, capacity: 3 },
]

const waitingParts = [
  {
    name: 'Kampas Rem Belakang Beat',
    order: 'WO-2026-012',
    qty: '1 set',
    status: 'Dipesan' as const,
  },
  {
    name: 'V-Belt NMAX Original',
    order: 'WO-2026-013',
    qty: '1 pcs',
    status: 'Belum tersedia' as const,
  },
]

type CreateForm = {
  customer: string
  phone: string
  vehicle: string
  plate: string
  complaint: string
  mechanic: string
  estimate: string
}

const emptyForm: CreateForm = {
  customer: '',
  phone: '',
  vehicle: '',
  plate: '',
  complaint: '',
  mechanic: 'Slamet',
  estimate: '',
}

const inputClass =
  'w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20'
const labelClass = 'mb-1.5 block text-xs font-medium text-ink'

export function WorkshopPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'Semua'>('Semua')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState<CreateForm>(emptyForm)
  const [notice, setNotice] = useState<string | null>(null)
  const [sequence, setSequence] = useState(15)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('new') !== '1') return

    setForm({
      ...emptyForm,
      customer: searchParams.get('customer') ?? '',
      phone: searchParams.get('phone') ?? '',
      vehicle: searchParams.get('vehicle') ?? '',
      plate: searchParams.get('plate') ?? '',
    })
    setCreateOpen(true)
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null

  const counts = orders.reduce<Record<OrderStatus, number>>(
    (accumulator, order) => {
      accumulator[order.status] += 1
      return accumulator
    },
    { Menunggu: 0, Inspeksi: 0, Dikerjakan: 0, Selesai: 0 },
  )

  const normalizedQuery = query.trim().toLowerCase()
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'Semua' || order.status === activeFilter
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        order.id,
        order.customer,
        order.vehicle,
        order.plate,
        order.complaint,
        order.mechanic,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    return matchesFilter && matchesQuery
  })

  function resetFilters() {
    setQuery('')
    setActiveFilter('Semua')
  }

  function openCreate() {
    setForm({ ...emptyForm })
    setCreateOpen(true)
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const now = new Date()
    const estimatedValue = Number(form.estimate.replace(/\D/g, ''))
    const id = `WO-2026-${String(sequence).padStart(3, '0')}`
    const newOrder: Order = {
      id,
      customer: form.customer.trim(),
      phone: form.phone.trim() || '-',
      vehicle: form.vehicle.trim(),
      plate: form.plate.trim().toUpperCase() || '-',
      complaint: form.complaint.trim() || 'Tanpa catatan keluhan.',
      mechanic: form.mechanic,
      status: 'Menunggu',
      time: `Masuk ${formatClock(now)}`,
      estimate: estimatedValue > 0 ? formatRupiah(estimatedValue) : 'Rp 0',
      items:
        estimatedValue > 0
          ? [
              {
                name: 'Estimasi awal pekerjaan',
                qty: '1',
                price: formatRupiah(estimatedValue),
              },
            ]
          : [],
      notes: 'Dibuat dari formulir template (simulasi).',
      timeline: [
        { label: 'Work order dibuat', time: formatClock(now), done: true },
        { label: 'Inspeksi', time: '-', done: false },
        { label: 'Dikerjakan', time: '-', done: false },
        { label: 'Selesai', time: '-', done: false },
      ],
    }

    setOrders((previous) => [newOrder, ...previous])
    setSequence((previous) => previous + 1)
    setCreateOpen(false)
    resetFilters()
    setNotice(
      `Work order ${id} berhasil dibuat dan masuk ke antrean (simulasi).`,
    )
  }

  function markDone(id: string) {
    const now = formatClock(new Date())

    setOrders((previous) =>
      previous.map((order) =>
        order.id === id
          ? {
              ...order,
              status: 'Selesai',
              time: `Selesai ${now}`,
              timeline: order.timeline.map((step) => ({
                ...step,
                done: true,
                time: step.done ? step.time : now,
              })),
            }
          : order,
      ),
    )
    setNotice(`Work order ${id} ditandai selesai (simulasi).`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bengkel"
        description="Work order, estimasi, dan progres pengerjaan servis."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              <Filter className="h-4 w-4" aria-hidden="true" />
              Reset filter
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Work order baru
            </Button>
          </>
        }
      />

      {notice ? (
        <Notice tone="success" onDismiss={() => setNotice(null)}>
          {notice}
        </Notice>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Menunggu"
          value={String(counts.Menunggu)}
          hint="Belum mulai"
          icon={Clock}
          tone="neutral"
        />
        <StatCard
          label="Inspeksi"
          value={String(counts.Inspeksi)}
          hint="Sedang dicek"
          icon={AlertTriangle}
          tone="brand"
        />
        <StatCard
          label="Dikerjakan"
          value={String(counts.Dikerjakan)}
          hint="Di meja mekanik"
          icon={Wrench}
        />
        <StatCard
          label="Selesai"
          value={String(counts.Selesai)}
          hint="Siap diserahkan"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={filters}
          value={activeFilter}
          onChange={setActiveFilter}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Cari WO, pelanggan, atau plat"
          label="Cari work order"
          className="sm:w-64"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="Work order tidak ditemukan"
              description="Coba kata kunci lain atau tampilkan semua status."
              action={
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Reset filter
                </Button>
              }
            />
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
                      {order.id}
                    </span>
                    <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                  </div>
                  <span className="text-xs text-muted">{order.time}</span>
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted">{order.phone}</p>
                    <p className="mt-1 text-xs font-medium text-brand-deep">
                      {order.vehicle} · {order.plate}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {order.complaint}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-control bg-canvas px-3 py-2 text-left sm:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      Estimasi
                    </p>
                    <p className="text-sm font-medium text-ink">
                      {order.estimate}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Mekanik: {order.mechanic}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Jadwal hari ini</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
                  >
                    Lihat detail
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">Beban Mekanik</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Work order aktif per mekanik
                </p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {mechanicLoad.map((mechanic) => {
                const percent = Math.round(
                  (mechanic.active / mechanic.capacity) * 100,
                )
                return (
                  <div key={mechanic.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">
                        {mechanic.name}
                      </span>
                      <span className="text-muted">
                        {mechanic.active}/{mechanic.capacity} WO
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                      <div
                        className={
                          percent >= 75
                            ? 'h-full rounded-full bg-brand'
                            : 'h-full rounded-full bg-brand/50'
                        }
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">
                  Sparepart Ditunggu
                </h2>
                <p className="mt-0.5 text-xs text-muted">Menahan pengerjaan</p>
              </div>
              <AlertTriangle
                className="h-5 w-5 text-brand"
                aria-hidden="true"
              />
            </CardHeader>
            <div className="divide-y divide-line">
              {waitingParts.map((part) => (
                <div key={part.order} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{part.name}</p>
                    <Badge
                      tone={part.status === 'Dipesan' ? 'info' : 'danger'}
                    >
                      {part.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {part.order} · {part.qty}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-5 py-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
              >
                Buat permintaan pembelian
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {selectedOrder ? (
        <Drawer
          open
          onClose={() => setSelectedId(null)}
          title={selectedOrder.id}
          description={`${selectedOrder.customer} · ${selectedOrder.vehicle} ${selectedOrder.plate}`}
          footer={
            <div className="flex items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Tutup
              </Button>
              {selectedOrder.status === 'Selesai' ? (
                <Badge tone="success">Selesai</Badge>
              ) : (
                <Button onClick={() => markDone(selectedOrder.id)}>
                  Tandai selesai
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={statusTone[selectedOrder.status]}>
                {selectedOrder.status}
              </Badge>
              <span className="text-xs text-muted">{selectedOrder.time}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-control bg-canvas p-3 text-xs">
              <div>
                <p className="text-muted">Pelanggan</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedOrder.customer}
                </p>
              </div>
              <div>
                <p className="text-muted">Telepon</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedOrder.phone}
                </p>
              </div>
              <div>
                <p className="text-muted">Motor</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedOrder.vehicle}
                </p>
              </div>
              <div>
                <p className="text-muted">Plat nomor</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedOrder.plate}
                </p>
              </div>
              <div>
                <p className="text-muted">Mekanik</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedOrder.mechanic}
                </p>
              </div>
              <div>
                <p className="text-muted">Estimasi</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedOrder.estimate}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Keluhan</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {selectedOrder.complaint}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Progres</h3>
              <ol className="mt-2 space-y-2">
                {selectedOrder.timeline.map((step) => (
                  <li key={step.label} className="flex items-center gap-2.5">
                    {step.done ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Clock
                        className="h-4 w-4 shrink-0 text-muted/50"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={
                        step.done
                          ? 'flex-1 text-xs text-ink'
                          : 'flex-1 text-xs text-muted'
                      }
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] text-muted">{step.time}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">
                Estimasi pekerjaan
              </h3>
              {selectedOrder.items.length === 0 ? (
                <p className="mt-1 text-xs text-muted">
                  Belum ada item pekerjaan.
                </p>
              ) : (
                <div className="mt-2 divide-y divide-line rounded-control border border-line">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
                    >
                      <span className="min-w-0 flex-1 text-ink">
                        {item.name}
                        <span className="ml-1 text-muted">×{item.qty}</span>
                      </span>
                      <span className="shrink-0 text-ink">{item.price}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 text-xs font-medium">
                    <span className="text-ink">Total estimasi</span>
                    <span className="text-brand-deep">
                      {selectedOrder.estimate}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Catatan</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {selectedOrder.notes}
              </p>
            </div>
          </div>
        </Drawer>
      ) : null}

      <Drawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Work order baru"
        description="Formulir simulasi. Data hanya tersimpan selama halaman terbuka."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="create-work-order"
              disabled={!form.customer.trim() || !form.vehicle.trim()}
            >
              Simpan work order
            </Button>
          </div>
        }
      >
        <form
          id="create-work-order"
          onSubmit={handleCreate}
          className="space-y-4"
        >
          <div>
            <label htmlFor="wo-customer" className={labelClass}>
              Nama pelanggan <span className="text-brand">*</span>
            </label>
            <input
              id="wo-customer"
              type="text"
              required
              value={form.customer}
              onChange={(event) =>
                setForm({ ...form, customer: event.target.value })
              }
              placeholder="Contoh: Budi Santoso"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="wo-phone" className={labelClass}>
              Nomor telepon
            </label>
            <input
              id="wo-phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="0812-3456-7890"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wo-vehicle" className={labelClass}>
                Motor <span className="text-brand">*</span>
              </label>
              <input
                id="wo-vehicle"
                type="text"
                required
                value={form.vehicle}
                onChange={(event) =>
                  setForm({ ...form, vehicle: event.target.value })
                }
                placeholder="Honda Beat"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="wo-plate" className={labelClass}>
                Plat nomor
              </label>
              <input
                id="wo-plate"
                type="text"
                value={form.plate}
                onChange={(event) =>
                  setForm({ ...form, plate: event.target.value.toUpperCase() })
                }
                placeholder="B 1234 XYZ"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="wo-complaint" className={labelClass}>
              Keluhan / permintaan
            </label>
            <textarea
              id="wo-complaint"
              rows={3}
              value={form.complaint}
              onChange={(event) =>
                setForm({ ...form, complaint: event.target.value })
              }
              placeholder="Tulis keluhan pelanggan atau pekerjaan yang diminta"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wo-mechanic" className={labelClass}>
                Mekanik
              </label>
              <select
                id="wo-mechanic"
                value={form.mechanic}
                onChange={(event) =>
                  setForm({ ...form, mechanic: event.target.value })
                }
                className={inputClass}
              >
                <option value="Slamet">Slamet</option>
                <option value="Joko">Joko</option>
                <option value="Bayu">Bayu</option>
              </select>
            </div>
            <div>
              <label htmlFor="wo-estimate" className={labelClass}>
                Estimasi biaya
              </label>
              <input
                id="wo-estimate"
                type="number"
                min={0}
                step={1000}
                value={form.estimate}
                onChange={(event) =>
                  setForm({ ...form, estimate: event.target.value })
                }
                placeholder="185000"
                className={inputClass}
              />
            </div>
          </div>

          <p className="rounded-control bg-canvas px-3 py-2 text-[11px] leading-relaxed text-muted">
            Work order baru akan muncul di daftar dengan status{' '}
            <span className="font-medium text-ink">Menunggu</span>. Belum ada
            pengiriman data ke server.
          </p>
        </form>
      </Drawer>
    </div>
  )
}
