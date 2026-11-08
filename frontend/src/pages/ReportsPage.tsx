import {
  Bike,
  CalendarRange,
  Download,
  TrendingUp,
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
} from '../components/ui'

const dailyRevenue = [
  { day: 'Sen', value: 4.1 },
  { day: 'Sel', value: 5.2 },
  { day: 'Rab', value: 4.8 },
  { day: 'Kam', value: 6.3 },
  { day: 'Jum', value: 5.9 },
  { day: 'Sab', value: 8.1 },
  { day: 'Min', value: 8.4 },
]

const composition = [
  { label: 'Servis', value: 52, amount: 'Rp 22.256.000' },
  { label: 'Penjualan barang', value: 31, amount: 'Rp 13.268.000' },
  { label: 'Penjualan motor', value: 17, amount: 'Rp 7.276.000' },
]

const categoryRows = [
  {
    label: 'Servis bengkel',
    transactions: 76,
    revenue: 'Rp 22.256.000',
    profit: 'Rp 9.840.000',
    margin: '44%',
  },
  {
    label: 'Penjualan barang',
    transactions: 148,
    revenue: 'Rp 13.268.000',
    profit: 'Rp 3.120.000',
    margin: '24%',
  },
  {
    label: 'Penjualan motor',
    transactions: 3,
    revenue: 'Rp 7.276.000',
    profit: 'Rp 1.640.000',
    margin: '23%',
  },
]

const topItems = [
  { name: 'Oli Yamalube 10W-40', qty: '48 terjual', amount: 'Rp 2.304.000' },
  { name: 'Jasa Servis Rutin', qty: '36 transaksi', amount: 'Rp 1.800.000' },
  { name: 'Kampas Rem Beat', qty: '22 terjual', amount: 'Rp 1.430.000' },
  { name: 'V-Belt NMAX Original', qty: '9 terjual', amount: 'Rp 1.215.000' },
  { name: 'Busi NGK CPR9', qty: '31 terjual', amount: 'Rp 682.000' },
]

export function ReportsPage() {
  const maxRevenue = Math.max(...dailyRevenue.map((item) => item.value))
  const totalRevenue = dailyRevenue.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan"
        description="Ringkasan penjualan, servis, stok, dan estimasi profit."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <CalendarRange className="h-4 w-4" aria-hidden="true" />
              1–9 Nov 2026
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh PDF
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pendapatan"
          value="Rp 42,8 jt"
          hint="+14,2% dari periode lalu"
          icon={Wallet}
        />
        <StatCard label="Transaksi Servis" value="76" hint="Rata-rata Rp 293 rb" icon={Wrench} tone="success" />
        <StatCard label="Motor Terjual" value="3" hint="Nilai Rp 7,27 jt" icon={Bike} tone="brand" />
        <StatCard
          label="Estimasi Profit"
          value="Rp 12,4 jt"
          hint="Margin 29%"
          icon={TrendingUp}
          tone="neutral"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Pendapatan Harian</h2>
              <p className="mt-0.5 text-xs text-muted">
                Dalam juta rupiah · total Rp {totalRevenue.toFixed(1).replace('.', ',')} jt
              </p>
            </div>
            <Badge tone="success">+14,2%</Badge>
          </CardHeader>
          <CardBody>
            <div className="flex h-52 items-end justify-between gap-2 sm:gap-3">
              {dailyRevenue.map((item) => {
                const height = Math.max(8, (item.value / maxRevenue) * 100)
                const isPeak = item.value === maxRevenue
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
                        isPeak
                          ? 'w-full max-w-12 rounded-t-md bg-brand'
                          : 'w-full max-w-12 rounded-t-md bg-brand/30'
                      }
                      style={{ height: `${height}%` }}
                    />
                    <span
                      className={
                        isPeak
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
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Komposisi Pendapatan</h2>
              <p className="mt-0.5 text-xs text-muted">Per kategori</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {composition.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="text-muted">{item.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                  <div
                    className="h-full rounded-full bg-brand/60"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted">{item.amount}</p>
              </div>
            ))}
            <div className="rounded-control bg-canvas px-3 py-2">
              <p className="text-xs text-muted">Total pendapatan</p>
              <p className="mt-0.5 font-display text-xl text-ink">Rp 42.800.000</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Rincian per Kategori</h2>
              <p className="mt-0.5 text-xs text-muted">Pendapatan dan estimasi margin</p>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-widest text-muted">
                  <th className="px-5 py-3 font-medium">Kategori</th>
                  <th className="px-3 py-3 font-medium">Transaksi</th>
                  <th className="px-3 py-3 font-medium">Pendapatan</th>
                  <th className="px-3 py-3 font-medium">Profit</th>
                  <th className="px-5 py-3 text-right font-medium">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {categoryRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-3 font-medium text-ink">{row.label}</td>
                    <td className="px-3 py-3 text-xs text-muted">{row.transactions}</td>
                    <td className="px-3 py-3 text-xs text-ink">{row.revenue}</td>
                    <td className="px-3 py-3 text-xs text-ink">{row.profit}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone="success">{row.margin}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Produk & Jasa Terlaris</h2>
              <p className="mt-0.5 text-xs text-muted">Berdasarkan nilai penjualan</p>
            </div>
          </CardHeader>
          <div className="divide-y divide-line">
            {topItems.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 px-5 py-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand-deep">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{item.name}</p>
                  <p className="text-[11px] text-muted">{item.qty}</p>
                </div>
                <p className="shrink-0 text-xs font-medium text-ink">{item.amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-xs text-muted">
        Laporan masih memakai data contoh. Filter periode, ekspor, dan perhitungan
        profit belum aktif.
      </p>
    </div>
  )
}
