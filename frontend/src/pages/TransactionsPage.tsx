import {
  Bike,
  CalendarDays,
  ChevronRight,
  Download,
  Package,
  Plus,
  Printer,
  ReceiptText,
  Wallet,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'
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

type TransactionType = 'Servis' | 'Barang' | 'Motor'
type PaymentStatus = 'Lunas' | 'Belum Lunas'

type TransactionItem = {
  name: string
  qty: string
  price: string
}

type Transaction = {
  id: string
  date: string
  time: string
  customer: string
  type: TransactionType
  method: string
  total: string
  status: PaymentStatus
  cashier: string
  items: TransactionItem[]
}

const typeTone: Record<TransactionType, BadgeTone> = {
  Servis: 'info',
  Barang: 'warning',
  Motor: 'success',
}

const statusTone: Record<PaymentStatus, BadgeTone> = {
  Lunas: 'success',
  'Belum Lunas': 'danger',
}

const tabs: Array<TransactionType | 'Semua'> = [
  'Semua',
  'Servis',
  'Barang',
  'Motor',
]

const initialTransactions: Transaction[] = [
  {
    id: 'INV-2026-118',
    date: '9 Nov 2026',
    time: '09.42',
    customer: 'Budi Santoso',
    type: 'Servis',
    method: 'Tunai',
    total: 'Rp 185.000',
    status: 'Lunas',
    cashier: 'Siti',
    items: [
      { name: 'Jasa servis rutin', qty: '1', price: 'Rp 100.000' },
      { name: 'Oli Yamalube 10W-40', qty: '1', price: 'Rp 48.000' },
      { name: 'Kampas rem depan', qty: '1', price: 'Rp 37.000' },
    ],
  },
  {
    id: 'INV-2026-117',
    date: '9 Nov 2026',
    time: '09.20',
    customer: 'Siti Aminah',
    type: 'Barang',
    method: 'Transfer',
    total: 'Rp 135.000',
    status: 'Lunas',
    cashier: 'Siti',
    items: [{ name: 'V-Belt NMAX Original', qty: '1', price: 'Rp 135.000' }],
  },
  {
    id: 'INV-2026-116',
    date: '9 Nov 2026',
    time: '08.55',
    customer: 'Rudi Hartono',
    type: 'Servis',
    method: 'QRIS',
    total: 'Rp 145.000',
    status: 'Belum Lunas',
    cashier: 'Pak Arif',
    items: [
      { name: 'Jasa setel rem', qty: '1', price: 'Rp 50.000' },
      { name: 'Kampas rem belakang', qty: '1', price: 'Rp 65.000' },
      { name: 'Setel rem', qty: '1', price: 'Rp 30.000' },
    ],
  },
  {
    id: 'INV-2026-115',
    date: '9 Nov 2026',
    time: '08.30',
    customer: 'Dewi Lestari',
    type: 'Motor',
    method: 'Transfer',
    total: 'Rp 27.500.000',
    status: 'Lunas',
    cashier: 'Pak Arif',
    items: [
      {
        name: 'Yamaha Aerox 155 (2022)',
        qty: '1',
        price: 'Rp 27.500.000',
      },
    ],
  },
  {
    id: 'INV-2026-114',
    date: '9 Nov 2026',
    time: '08.10',
    customer: 'Agus Setiawan',
    type: 'Barang',
    method: 'Tunai',
    total: 'Rp 88.000',
    status: 'Lunas',
    cashier: 'Siti',
    items: [
      { name: 'Oli Shell Advance AX7', qty: '1', price: 'Rp 62.000' },
      { name: 'Jasa servis ringan', qty: '1', price: 'Rp 26.000' },
    ],
  },
  {
    id: 'INV-2026-113',
    date: '9 Nov 2026',
    time: '07.58',
    customer: 'Nina Kartika',
    type: 'Servis',
    method: 'QRIS',
    total: 'Rp 75.000',
    status: 'Lunas',
    cashier: 'Siti',
    items: [
      { name: 'Jasa servis ringan', qty: '1', price: 'Rp 30.000' },
      { name: 'Oli Yamalube 10W-40', qty: '1', price: 'Rp 45.000' },
    ],
  },
  {
    id: 'INV-2026-112',
    date: '9 Nov 2026',
    time: '07.40',
    customer: 'Hendra Wijaya',
    type: 'Barang',
    method: 'Tunai',
    total: 'Rp 42.000',
    status: 'Lunas',
    cashier: 'Siti',
    items: [
      { name: 'Busi NGK CPR9', qty: '1', price: 'Rp 22.000' },
      { name: 'Filter udara', qty: '1', price: 'Rp 20.000' },
    ],
  },
]

const paymentBreakdown = [
  { label: 'Tunai', value: 45, amount: 'Rp 652.000' },
  { label: 'Transfer', value: 35, amount: 'Rp 27.970.000' },
  { label: 'QRIS', value: 20, amount: 'Rp 220.000' },
]

export function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions)
  const [activeTab, setActiveTab] = useState<TransactionType | 'Semua'>('Semua')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const selectedTransaction =
    transactions.find((transaction) => transaction.id === selectedId) ?? null

  const normalizedQuery = query.trim().toLowerCase()
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTab = activeTab === 'Semua' || transaction.type === activeTab
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        transaction.id,
        transaction.customer,
        transaction.method,
        transaction.type,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    return matchesTab && matchesQuery
  })

  function resetFilters() {
    setQuery('')
    setActiveTab('Semua')
  }

  function markPaid(transaction: Transaction) {
    setTransactions((previous) =>
      previous.map((item) =>
        item.id === transaction.id ? { ...item, status: 'Lunas' } : item,
      ),
    )
    setNotice(`Nota ${transaction.id} ditandai lunas (simulasi).`)
  }

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

      {notice ? (
        <Notice tone="success" onDismiss={() => setNotice(null)}>
          {notice}
        </Notice>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Hari Ini"
          value="Rp 1,45 jt"
          hint="Termasuk penjualan motor"
          icon={Wallet}
        />
        <StatCard
          label="Total Transaksi"
          value="12"
          hint="7 belum ditampilkan"
          icon={ReceiptText}
        />
        <StatCard
          label="Servis"
          value="8"
          hint="Rata-rata Rp 142 rb"
          icon={Wrench}
          tone="success"
        />
        <StatCard
          label="Penjualan Barang"
          value="3"
          hint="12 item terjual"
          icon={Package}
          tone="neutral"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={tabs}
          value={activeTab}
          onChange={setActiveTab}
        />
        <div className="flex items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Cari nota atau pelanggan"
            label="Cari transaksi"
            className="flex-1 sm:w-60"
          />
          <Button variant="secondary" size="sm" aria-label="Unduh transaksi">
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">
                Transaksi Hari Ini
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Senin, 9 November 2026
              </p>
            </div>
            <Badge tone="neutral">{filteredTransactions.length} nota</Badge>
          </CardHeader>

          {filteredTransactions.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={ReceiptText}
                title="Transaksi tidak ditemukan"
                description="Coba kata kunci lain atau tampilkan semua jenis transaksi."
                action={
                  <Button variant="secondary" size="sm" onClick={resetFilters}>
                    Reset filter
                  </Button>
                }
              />
            </div>
          ) : (
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
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      tabIndex={0}
                      onClick={() => setSelectedId(transaction.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          setSelectedId(transaction.id)
                        }
                      }}
                      className="cursor-pointer transition-colors hover:bg-canvas/60 focus-visible:bg-canvas focus-visible:outline-none"
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">
                          {transaction.id}
                        </p>
                        <p className="text-xs text-muted">{transaction.time}</p>
                      </td>
                      <td className="px-3 py-3 text-xs text-ink">
                        {transaction.customer}
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={typeTone[transaction.type]}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted">
                        {transaction.method}
                      </td>
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
          )}

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <p className="text-xs text-muted">
              Menampilkan {filteredTransactions.length} dari{' '}
              {transactions.length} transaksi
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
            >
              Tampilkan semua
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">
                  Metode Pembayaran
                </h2>
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
                  <p className="mt-1 text-[11px] text-muted">
                    {method.value}% dari total
                  </p>
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
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              onClick={() => setSelectedId('INV-2026-115')}
            >
              Buka nota
            </Button>
          </Card>

          <p className="px-1 text-xs text-muted">
            Klik baris transaksi untuk membuka detail nota. Perubahan status hanya
            berlaku selama halaman terbuka.
          </p>
        </div>
      </div>

      {selectedTransaction ? (
        <Drawer
          open
          onClose={() => setSelectedId(null)}
          title={`Nota ${selectedTransaction.id}`}
          description={`${selectedTransaction.customer} · ${selectedTransaction.date} ${selectedTransaction.time}`}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Tutup
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setNotice(
                      `Nota ${selectedTransaction.id} siap dicetak (simulasi).`,
                    )
                  }
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Cetak
                </Button>
                {selectedTransaction.status === 'Lunas' ? (
                  <Badge tone="success">Lunas</Badge>
                ) : (
                  <Button onClick={() => markPaid(selectedTransaction)}>
                    Tandai lunas
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="rounded-card border border-line bg-canvas/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-ink">Garasi Hobby</p>
                  <p className="text-[11px] text-muted">
                    Jl. Raya Motor No. 88, Jakarta Selatan
                  </p>
                  <p className="text-[11px] text-muted">0812-9000-1234</p>
                </div>
                <Badge tone={statusTone[selectedTransaction.status]}>
                  {selectedTransaction.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted">Pelanggan</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedTransaction.customer}
                </p>
              </div>
              <div>
                <p className="text-muted">Jenis</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedTransaction.type}
                </p>
              </div>
              <div>
                <p className="text-muted">Metode</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedTransaction.method}
                </p>
              </div>
              <div>
                <p className="text-muted">Kasir</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedTransaction.cashier}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Rincian item</h3>
              <div className="mt-2 divide-y divide-line rounded-control border border-line">
                {selectedTransaction.items.map((item) => (
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
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-xs font-medium text-ink">Total</span>
                  <span className="text-sm font-medium text-brand-deep">
                    {selectedTransaction.total}
                  </span>
                </div>
              </div>
            </div>

            <p className="rounded-control bg-canvas px-3 py-2 text-[11px] leading-relaxed text-muted">
              Nota ini hanya contoh tampilan. Belum ada pencatatan pembayaran,
              pajak, atau diskon yang dihitung otomatis.
            </p>
          </div>
        </Drawer>
      ) : null}
    </div>
  )
}
