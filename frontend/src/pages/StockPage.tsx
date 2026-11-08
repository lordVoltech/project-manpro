import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Download,
  Filter,
  Package,
  Plus,
  Search,
  Wallet,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  PageHeader,
  StatCard,
  type BadgeTone,
} from '../components/ui'

type StockStatus = 'Aman' | 'Menipis' | 'Habis'

const statusTone: Record<StockStatus, BadgeTone> = {
  Aman: 'success',
  Menipis: 'warning',
  Habis: 'danger',
}

const parts: Array<{
  sku: string
  name: string
  category: string
  stock: number
  min: number
  price: string
  status: StockStatus
}> = [
  {
    sku: 'OLI-YML-10W',
    name: 'Oli Mesin Yamalube 10W-40',
    category: 'Pelumas',
    stock: 4,
    min: 12,
    price: 'Rp 48.000',
    status: 'Menipis',
  },
  {
    sku: 'KMP-BT-002',
    name: 'Kampas Rem Belakang Beat',
    category: 'Pengereman',
    stock: 2,
    min: 10,
    price: 'Rp 65.000',
    status: 'Menipis',
  },
  {
    sku: 'VBL-NMX-001',
    name: 'V-Belt NMAX Original',
    category: 'CVT',
    stock: 0,
    min: 8,
    price: 'Rp 135.000',
    status: 'Habis',
  },
  {
    sku: 'BSI-NGK-CPR9',
    name: 'Busi NGK CPR9',
    category: 'Pengapian',
    stock: 48,
    min: 20,
    price: 'Rp 22.000',
    status: 'Aman',
  },
  {
    sku: 'FLT-HND-003',
    name: 'Filter Udara Honda Beat',
    category: 'Filter',
    stock: 21,
    min: 10,
    price: 'Rp 38.000',
    status: 'Aman',
  },
  {
    sku: 'OLI-SHL-ADV',
    name: 'Oli Shell Advance AX7',
    category: 'Pelumas',
    stock: 18,
    min: 10,
    price: 'Rp 62.000',
    status: 'Aman',
  },
  {
    sku: 'LMP-HND-005',
    name: 'Lampu LED Depan Honda',
    category: 'Kelistrikan',
    stock: 9,
    min: 5,
    price: 'Rp 85.000',
    status: 'Aman',
  },
  {
    sku: 'RNT-VR-010',
    name: 'Rantai Keteng Vario',
    category: 'Mesin',
    stock: 12,
    min: 6,
    price: 'Rp 110.000',
    status: 'Aman',
  },
]

const movements = [
  {
    name: 'Oli Mesin Yamalube 10W-40',
    note: 'Pembelian supplier',
    qty: '+24',
    direction: 'in' as const,
    time: '09.10',
  },
  {
    name: 'Kampas Rem Belakang Beat',
    note: 'WO-2026-012',
    qty: '-2',
    direction: 'out' as const,
    time: '08.42',
  },
  {
    name: 'Busi NGK CPR9',
    note: 'Restock mingguan',
    qty: '+50',
    direction: 'in' as const,
    time: '08.15',
  },
  {
    name: 'V-Belt NMAX Original',
    note: 'WO-2026-013',
    qty: '-1',
    direction: 'out' as const,
    time: '07.55',
  },
]

export function StockPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stok"
        description="Saldo barang, pergerakan stok, dan peringatan stok menipis."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              Ekspor
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah barang
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Total Item" value="128" hint="8 kategori" icon={Boxes} />
        <StatCard
          label="Nilai Stok"
          value="Rp 24,75 jt"
          hint="Harga beli terakhir"
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="Stok Menipis"
          value="2 item"
          hint="Di bawah minimum"
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Stok Habis"
          value="1 item"
          hint="Perlu dibeli"
          icon={Package}
          tone="neutral"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              3 barang perlu perhatian
            </p>
            <p className="text-xs text-amber-800">
              V-Belt NMAX habis, sementara oli dan kampas rem berada di bawah batas
              minimum.
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="shrink-0">
          Buat permintaan pembelian
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg text-ink">Daftar Barang</h2>
              <p className="mt-0.5 text-xs text-muted">Urut dari stok terendah</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-52">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Cari barang atau SKU"
                  className="w-full rounded-control border border-line bg-canvas py-2 pl-9 pr-3 text-xs text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <Button variant="secondary" size="sm" aria-label="Filter barang">
                <Filter className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-widest text-muted">
                  <th className="px-5 py-3 font-medium">Barang</th>
                  <th className="px-3 py-3 font-medium">Kategori</th>
                  <th className="px-3 py-3 font-medium">Stok</th>
                  <th className="px-3 py-3 font-medium">Harga</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {parts.map((part) => (
                  <tr key={part.sku} className="transition-colors hover:bg-canvas/60">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{part.name}</p>
                      <p className="text-xs text-muted">{part.sku}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted">{part.category}</td>
                    <td className="px-3 py-3">
                      <p
                        className={
                          part.status === 'Habis'
                            ? 'text-sm font-medium text-red-700'
                            : part.status === 'Menipis'
                              ? 'text-sm font-medium text-amber-700'
                              : 'text-sm font-medium text-ink'
                        }
                      >
                        {part.stock} pcs
                      </p>
                      <p className="text-[11px] text-muted">min. {part.min}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-ink">{part.price}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={statusTone[part.status]}>{part.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">Pergerakan Terbaru</h2>
                <p className="mt-0.5 text-xs text-muted">Hari ini</p>
              </div>
            </CardHeader>
            <div className="divide-y divide-line">
              {movements.map((movement) => (
                <div key={`${movement.name}-${movement.time}`} className="flex items-start gap-3 px-5 py-3.5">
                  <span
                    className={
                      movement.direction === 'in'
                        ? 'mt-0.5 rounded-control bg-emerald-50 p-1.5 text-emerald-700'
                        : 'mt-0.5 rounded-control bg-red-50 p-1.5 text-red-700'
                    }
                  >
                    {movement.direction === 'in' ? (
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {movement.name}
                    </p>
                    <p className="text-xs text-muted">{movement.note}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        movement.direction === 'in'
                          ? 'text-sm font-medium text-emerald-700'
                          : 'text-sm font-medium text-red-700'
                      }
                    >
                      {movement.qty}
                    </p>
                    <p className="text-[11px] text-muted">{movement.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-5 py-3">
              <button
                type="button"
                className="text-xs font-medium text-brand-deep hover:text-brand"
              >
                Lihat semua pergerakan
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-lg text-ink">Ringkasan Kategori</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Pelumas', value: 62 },
                { label: 'Pengereman', value: 74 },
                { label: 'CVT & Mesin', value: 45 },
                { label: 'Kelistrikan', value: 88 },
              ].map((category) => (
                <div key={category.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">{category.label}</span>
                    <span className="font-medium text-ink">{category.value}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-brand/60"
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Persentase ketersediaan terhadap batas minimum.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
