import {
  Bike,
  CalendarDays,
  ChevronRight,
  Download,
  Package,
  Plus,
  ReceiptText,
  Search,
  Wallet,
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

type TransactionType = 'Servis' | 'Barang' | 'Motor'
type PaymentStatus = 'Lunas' | 'Belum Lunas'

const typeTone: Record<TransactionType, BadgeTone> = {
  Servis: 'info',
  Barang: 'warning',
  Motor: 'success',
}

const statusTone: Record<PaymentStatus, BadgeTone> = {
  Lunas: 'success',
  'Belum Lunas': 'danger',
}

const tabs: Array<TransactionType | 'Semua'> = ['Semua', 'Servis', 'Barang', 'Motor']

const transactions: Array<{
  id: string
  time: string
  customer: string
  type: TransactionType
  method: string
  total: string
  status: PaymentStatus
}> = [
  {
    id: 'INV-2026-118',
    time: '09.42',
    customer: 'Budi Santoso',
    type: 'Servis',
    method: 'Tunai',
    total: 'Rp 185.000',
    status: 'Lunas',
  },
  {
    id: 'INV-2026-117',
    time: '09.20',
    customer: 'Siti Aminah',
    type: 'Barang',
    method: 'Transfer',
    total: 'Rp 135.000',
    status: 'Lunas',
  },
  {
    id: 'INV-2026-116',
    time: '08.55',
    customer: 'Rudi Hartono',
    type: 'Servis',
    method: 'QRIS',
    total: 'Rp 145.000',
    status: 'Belum Lunas',
  },
  {
    id: 'INV-2026-115',
    time: '08.30',
    customer: 'Dewi Lestari',
    type: 'Motor',
    method: 'Transfer',
    total: 'Rp 27.500.000',
    status: 'Lunas',
  },
  {
    id: 'INV-2026-114',
    time: '08.10',
    customer: 'Agus Setiawan',
    type: 'Barang',
    method: 'Tunai',
    total: 'Rp 88.000',
    status: 'Lunas',
  },
  {
    id: 'INV-2026-113',
    time: '07.58',
    customer: 'Nina Kartika',
    type: 'Servis',
    method: 'QRIS',
    total: 'Rp 75.000',
    status: 'Lunas',
  },
  {
    id: 'INV-2026-112',
    time: '07.40',
    customer: 'Hendra Wijaya',
    type: 'Barang',
    method: 'Tunai',
    total: 'Rp 42.000',
    status: 'Lunas',
  },
]

const paymentBreakdown = [
  { label: 'Tunai', value: 45, amount: 'Rp 652.000' },
  { label: 'Transfer', value: 35, amount: 'Rp 27.970.000' },
  { label: 'QRIS', value: 20, amount: 'Rp 220.000' },
]

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaksi"
        description="Nota servis, penjualan barang, dan penjualan motor."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Hari ini
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Transaksi baru
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Hari Ini"
          value="Rp 1,45 jt"
          hint="Termasuk penjualan motor"
          icon={Wallet}
        />
        <StatCard label="Total Transaksi" value="12" hint="7 belum ditampilkan" icon={ReceiptText} />
        <StatCard label="Servis" value="8" hint="Rata-rata Rp 142 rb" icon={Wrench} tone="success" />
        <StatCard label="Penjualan Barang" value="3" hint="12 item terjual" icon={Package} tone="neutral" />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={
                index === 0
                  ? 'rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white'
                  : 'rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand-deep'
              }
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Cari nota atau pelanggan"
              className="w-full rounded-control border border-line bg-canvas py-2 pl-9 pr-3 text-xs text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <Button variant="secondary" size="sm" aria-label="Unduh transaksi">
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Transaksi Hari Ini</h2>
              <p className="mt-0.5 text-xs text-muted">Senin, 9 November 2026</p>
            </div>
            <Badge tone="neutral">12 transaksi</Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-widest text-muted">
                  <th className="px-5 py-3 font-medium">Nota</th>
                  <th className="px-3 py-3 font-medium">Pelanggan</th>
                  <th className="px-3 py-3 font-medium">Jenis</th>
                  <th className="px-3 py-3 font-medium">Metode</th>
                  <th className="px-3 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="cursor-pointer transition-colors hover:bg-canvas/60"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{transaction.id}</p>
                      <p className="text-xs text-muted">{transaction.time}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-ink">{transaction.customer}</td>
                    <td className="px-3 py-3">
                      <Badge tone={typeTone[transaction.type]}>{transaction.type}</Badge>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted">{transaction.method}</td>
                    <td className="px-3 py-3 text-xs font-medium text-ink">
                      {transaction.total}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={statusTone[transaction.status]}>
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <p className="text-xs text-muted">Menampilkan 7 dari 12 transaksi</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
            >
              Lihat semua
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">Metode Pembayaran</h2>
                <p className="mt-0.5 text-xs text-muted">Hari ini</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {paymentBreakdown.map((method) => (
                <div key={method.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">{method.label}</span>
                    <span className="text-muted">{method.amount}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-brand/60"
                      style={{ width: `${method.value}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted">{method.value}% dari total</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-control bg-brand/10 p-2 text-brand-deep">
                <Bike className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted">
                  Transaksi terbesar
                </p>
                <p className="text-sm font-medium text-ink">Dewi Lestari</p>
              </div>
            </div>
            <p className="mt-3 font-display text-2xl text-ink">Rp 27.500.000</p>
            <p className="mt-1 text-xs text-muted">
              Yamaha Aerox 155 · INV-2026-115 · Transfer
            </p>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Buka nota
            </Button>
          </Card>

          <p className="px-1 text-xs text-muted">
            Klik baris transaksi untuk membuka detail nota. Fitur ini masih berupa
            tampilan.
          </p>
        </div>
      </div>
    </div>
  )
}
