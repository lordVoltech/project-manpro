import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Search,
  Wrench,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  StatCard,
  type BadgeTone,
} from '../components/ui'

type OrderStatus = 'Menunggu' | 'Inspeksi' | 'Dikerjakan' | 'Selesai'

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

const orders: Array<{
  id: string
  customer: string
  phone: string
  vehicle: string
  complaint: string
  mechanic: string
  status: OrderStatus
  time: string
  estimate: string
}> = [
  {
    id: 'WO-2026-014',
    customer: 'Budi Santoso',
    phone: '0812-3456-7890',
    vehicle: 'Honda Beat · B 1234 XYZ',
    complaint: 'Servis rutin, ganti oli, rem depan terasa blong',
    mechanic: 'Slamet',
    status: 'Dikerjakan',
    time: 'Masuk 09.15',
    estimate: 'Rp 185.000',
  },
  {
    id: 'WO-2026-013',
    customer: 'Siti Aminah',
    phone: '0857-1122-3344',
    vehicle: 'Yamaha NMAX · D 5678 ABC',
    complaint: 'CVT berisik saat digas, getaran terasa di kaki',
    mechanic: 'Joko',
    status: 'Inspeksi',
    time: 'Masuk 09.40',
    estimate: 'Rp 320.000',
  },
  {
    id: 'WO-2026-012',
    customer: 'Rudi Hartono',
    phone: '0813-9988-7766',
    vehicle: 'Honda Vario 125 · F 9021 KL',
    complaint: 'Ganti kampas rem belakang dan setel rem',
    mechanic: 'Slamet',
    status: 'Dikerjakan',
    time: 'Masuk 08.20',
    estimate: 'Rp 145.000',
  },
  {
    id: 'WO-2026-011',
    customer: 'Dewi Lestari',
    phone: '0821-4455-6677',
    vehicle: 'Yamaha Aerox · B 4455 QQ',
    complaint: 'Servis besar 20.000 km, cek seluruh bagian',
    mechanic: 'Joko',
    status: 'Dikerjakan',
    time: 'Masuk 08.05',
    estimate: 'Rp 540.000',
  },
  {
    id: 'WO-2026-010',
    customer: 'Agus Setiawan',
    phone: '0819-2233-4455',
    vehicle: 'Honda Scoopy · B 7788 TT',
    complaint: 'Motor sulit dinyalakan pagi hari',
    mechanic: 'Bayu',
    status: 'Menunggu',
    time: 'Masuk 07.50',
    estimate: 'Rp 95.000',
  },
  {
    id: 'WO-2026-009',
    customer: 'Nina Kartika',
    phone: '0838-6677-8899',
    vehicle: 'Yamaha Mio · B 3322 RR',
    complaint: 'Ganti oli dan cek tekanan angin',
    mechanic: 'Slamet',
    status: 'Selesai',
    time: 'Selesai 08.45',
    estimate: 'Rp 75.000',
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

export function WorkshopPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bengkel"
        description="Work order, estimasi, dan progres pengerjaan servis."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Work order baru
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Menunggu" value="1" hint="Belum mulai" icon={Clock} tone="neutral" />
        <StatCard label="Inspeksi" value="1" hint="Sedang dicek" icon={Search} tone="brand" />
        <StatCard label="Dikerjakan" value="3" hint="Di meja mekanik" icon={Wrench} />
        <StatCard
          label="Selesai Hari Ini"
          value="5"
          hint="Siap diserahkan"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={
                index === 0
                  ? 'rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white'
                  : 'rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand-deep'
              }
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Cari WO, pelanggan, atau plat"
            className="w-full rounded-control border border-line bg-canvas py-2 pl-9 pr-3 text-xs text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          {orders.map((order) => (
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
                  <p className="text-sm font-medium text-ink">{order.customer}</p>
                  <p className="text-xs text-muted">{order.phone}</p>
                  <p className="mt-1 text-xs font-medium text-brand-deep">
                    {order.vehicle}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {order.complaint}
                  </p>
                </div>
                <div className="shrink-0 rounded-control bg-canvas px-3 py-2 text-left sm:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted">
                    Estimasi
                  </p>
                  <p className="text-sm font-medium text-ink">{order.estimate}</p>
                  <p className="mt-1 text-xs text-muted">Mekanik: {order.mechanic}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Jadwal hari ini</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
                >
                  Lihat detail
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">Beban Mekanik</h2>
                <p className="mt-0.5 text-xs text-muted">Work order aktif per mekanik</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {mechanicLoad.map((mechanic) => {
                const percent = Math.round((mechanic.active / mechanic.capacity) * 100)
                return (
                  <div key={mechanic.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">{mechanic.name}</span>
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
                <h2 className="font-display text-lg text-ink">Sparepart Ditunggu</h2>
                <p className="mt-0.5 text-xs text-muted">Menahan pengerjaan</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-brand" aria-hidden="true" />
            </CardHeader>
            <div className="divide-y divide-line">
              {waitingParts.map((part) => (
                <div key={part.order} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{part.name}</p>
                    <Badge tone={part.status === 'Dipesan' ? 'info' : 'danger'}>
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
    </div>
  )
}
