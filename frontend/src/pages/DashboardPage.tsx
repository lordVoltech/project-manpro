import {
  AlertTriangle,
  ArrowRight,
  Bike,
  ClipboardList,
  Download,
  Package,
  Plus,
  ReceiptText,
  UserPlus,
  Wallet,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
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

type OrderStatus = 'Inspeksi' | 'Dikerjakan' | 'Menunggu Pembayaran'

const statusTone: Record<OrderStatus, BadgeTone> = {
  Inspeksi: 'info',
  Dikerjakan: 'warning',
  'Menunggu Pembayaran': 'danger',
}

const workOrders: Array<{
  id: string
  customer: string
  vehicle: string
  complaint: string
  status: OrderStatus
  mechanic: string
  time: string
  estimate: string
}> = [
  {
    id: 'WO-2026-014',
    customer: 'Budi Santoso',
    vehicle: 'Honda Beat · B 1234 XYZ',
    complaint: 'Servis rutin, ganti oli, rem depan',
    status: 'Dikerjakan',
    mechanic: 'Slamet',
    time: '09.15',
    estimate: 'Rp 185.000',
  },
  {
    id: 'WO-2026-013',
    customer: 'Siti Aminah',
    vehicle: 'Yamaha NMAX · D 5678 ABC',
    complaint: 'CVT berisik saat digas',
    status: 'Inspeksi',
    mechanic: 'Joko',
    time: '09.40',
    estimate: 'Rp 320.000',
  },
  {
    id: 'WO-2026-012',
    customer: 'Rudi Hartono',
    vehicle: 'Honda Vario 125 · F 9021 KL',
    complaint: 'Ganti kampas rem belakang',
    status: 'Menunggu Pembayaran',
    mechanic: 'Slamet',
    time: '08.20',
    estimate: 'Rp 145.000',
  },
  {
    id: 'WO-2026-011',
    customer: 'Dewi Lestari',
    vehicle: 'Yamaha Aerox · B 4455 QQ',
    complaint: 'Servis besar 20.000 km',
    status: 'Dikerjakan',
    mechanic: 'Joko',
    time: '08.05',
    estimate: 'Rp 540.000',
  },
]

const salesWeek = [
  { day: 'Sen', value: 1.2 },
  { day: 'Sel', value: 2.1 },
  { day: 'Rab', value: 1.6 },
  { day: 'Kam', value: 2.8 },
  { day: 'Jum', value: 2.3 },
  { day: 'Sab', value: 3.4 },
  { day: 'Min', value: 1.45 },
]

const lowStock = [
  { name: 'Oli Mesin Yamalube 10W-40', sku: 'OLI-YML-10W', stock: 4, min: 12 },
  { name: 'Kampas Rem Belakang Beat', sku: 'KMP-BT-002', stock: 2, min: 10 },
]

const showroomUnits = [
  {
    id: 'MTR-01',
    name: 'Yamaha NMAX 155 (2023)',
    price: 'Rp 27.500.000',
    status: 'Tersedia' as const,
  },
  {
    id: 'MTR-02',
    name: 'Honda Vario 160 (2024)',
    price: 'Rp 24.000.000',
    status: 'Reserved' as const,
  },
  {
    id: 'MTR-03',
    name: 'Honda PCX 160 (2022)',
    price: 'Rp 25.750.000',
    status: 'Tersedia' as const,
  },
]

const quickActions = [
  {
    label: 'Work order baru',
    description: 'Catat servis masuk',
    icon: Plus,
    to: '/workshop',
  },
  {
    label: 'Catat penjualan',
    description: 'Servis atau barang',
    icon: ReceiptText,
    to: '/transactions',
  },
  {
    label: 'Tambah stok',
    description: 'Barang masuk',
    icon: Package,
    to: '/stock',
  },
  {
    label: 'Pelanggan baru',
    description: 'Daftarkan motor',
    icon: UserPlus,
    to: '/customers',
  },
]

export function DashboardPage() {
  const maxSales = Math.max(...salesWeek.map((item) => item.value))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan operasional hari ini, Senin 9 November 2026."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh laporan
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Work order baru
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Hari Ini"
          value="Rp 1,45 jt"
          hint="+12% dari kemarin"
          icon={Wallet}
        />
        <StatCard
          label="Work Order Aktif"
          value="4"
          hint="2 dikerjakan · 1 inspeksi"
          icon={Wrench}
        />
        <StatCard
          label="Motor Tersedia"
          value="4 unit"
          hint="1 reserved"
          icon={Bike}
          tone="success"
        />
        <StatCard
          label="Stok Menipis"
          value="2 item"
          hint="Perlu restock hari ini"
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Work Order Aktif</h2>
              <p className="mt-0.5 text-xs text-muted">
                Pengerjaan bengkel yang sedang berjalan
              </p>
            </div>
            <Link
              to="/workshop"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
            >
              Lihat semua
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardHeader>
          <div className="divide-y divide-line">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{order.customer}</p>
                    <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {order.vehicle} · {order.id}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted/80">
                    {order.complaint}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <p className="text-sm font-medium text-ink">{order.estimate}</p>
                  <p className="text-xs text-muted">
                    {order.mechanic} · {order.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Penjualan 7 Hari</h2>
              <p className="mt-0.5 text-xs text-muted">Dalam juta rupiah</p>
            </div>
            <Badge tone="success">+8,4%</Badge>
          </CardHeader>
          <CardBody>
            <div className="flex h-40 items-end justify-between gap-2">
              {salesWeek.map((item) => {
                const height = Math.max(8, (item.value / maxSales) * 100)
                const isToday = item.day === 'Min'
                return (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] font-medium text-muted">
                      {item.value.toString().replace('.', ',')}
                    </span>
                    <div
                      className={
                        isToday
                          ? 'w-full rounded-t-md bg-brand'
                          : 'w-full rounded-t-md bg-brand/25'
                      }
                      style={{ height: `${height}%` }}
                    />
                    <span
                      className={
                        isToday
                          ? 'text-[11px] font-semibold text-brand-deep'
                          : 'text-[11px] text-muted'
                      }
                    >
                      {item.day}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-control bg-canvas px-3 py-2">
              <span className="text-xs text-muted">Total minggu ini</span>
              <span className="text-sm font-medium text-ink">Rp 14,85 jt</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Aksi Cepat</h2>
              <p className="mt-0.5 text-xs text-muted">
                Pekerjaan yang paling sering dipakai
              </p>
            </div>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className="group rounded-control border border-line bg-canvas/50 p-3 transition-colors hover:border-brand/40 hover:bg-brand/5"
                >
                  <span className="inline-flex rounded-control bg-brand/10 p-2 text-brand-deep">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-2 text-sm font-medium text-ink group-hover:text-brand-deep">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted">{action.description}</p>
                </Link>
              )
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Stok Menipis</h2>
              <p className="mt-0.5 text-xs text-muted">Di bawah batas minimum</p>
            </div>
            <Link
              to="/stock"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
            >
              Kelola stok
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardHeader>
          <div className="divide-y divide-line">
            {lowStock.map((item) => (
              <div key={item.sku} className="flex items-center gap-3 px-5 py-4">
                <span className="rounded-control bg-red-50 p-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-700">{item.stock} tersisa</p>
                  <p className="text-xs text-muted">min. {item.min}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-3">
            <p className="text-xs text-muted">
              Segera buat permintaan pembelian agar servis tidak tertunda.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2 className="font-display text-lg text-ink">Showroom Terbaru</h2>
            <p className="mt-0.5 text-xs text-muted">Unit yang siap ditawarkan</p>
          </div>
          <Link
            to="/showroom"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
          >
            Buka showroom
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </CardHeader>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {showroomUnits.map((unit) => (
            <div
              key={unit.id}
              className="flex items-center gap-3 rounded-control border border-line bg-canvas/40 p-3"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control bg-ink text-brand-light">
                <Bike className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{unit.name}</p>
                <p className="text-xs text-muted">{unit.price}</p>
              </div>
              <Badge tone={unit.status === 'Tersedia' ? 'success' : 'info'}>
                {unit.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-2 rounded-card border border-line bg-surface px-4 py-3 text-xs text-muted">
        <ClipboardList className="h-4 w-4 text-brand-deep" aria-hidden="true" />
        <p>
          Template statis: angka dan daftar di atas adalah contoh. Belum ada data
          tersimpan atau perhitungan otomatis.
        </p>
      </div>
    </div>
  )
}
