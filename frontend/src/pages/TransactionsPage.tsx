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
import { api, ApiError } from '../api'
import type {
  ListResponse,
  PaymentMethod,
  Transaction,
  TransactionType,
} from '../api/types'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  EmptyState,
  ErrorState,
  FilterChips,
  LoadingState,
  Notice,
  PageHeader,
  SearchField,
  StatCard,
} from '../components/ui'
import { useApiQuery } from '../hooks/useApiQuery'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import {
  formatCompactRupiah,
  formatDate,
  formatRupiah,
  formatTime,
} from '../lib/format'
import {
  paymentMethodLabels,
  paymentStatusLabels,
  transactionTypeLabels,
} from '../lib/labels'

type TypeFilter = 'Semua' | 'Servis' | 'Barang' | 'Motor'

const tabs: TypeFilter[] = ['Semua', 'Servis', 'Barang', 'Motor']

const typeByFilter: Record<Exclude<TypeFilter, 'Semua'>, TransactionType> = {
  Servis: 'servis',
  Barang: 'barang',
  Motor: 'motor',
}

type NoticeState = { tone: 'success' | 'danger'; message: string }

export function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<TypeFilter>('Semua')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const debouncedQuery = useDebouncedValue(query.trim())

  const typeParam = activeTab === 'Semua' ? undefined : typeByFilter[activeTab]

  const allTransactionsQuery = useApiQuery(
    () =>
      api.get<ListResponse<Transaction>>('/transactions', {
        query: { per_page: 100 },
      }),
    [],
  )

  const transactionsQuery = useApiQuery(
    () =>
      api.get<ListResponse<Transaction>>('/transactions', {
        query: {
          per_page: 100,
          type: typeParam,
          q: debouncedQuery || undefined,
        },
      }),
    [typeParam, debouncedQuery],
  )

  const allTransactions = allTransactionsQuery.data?.data ?? []
  const transactions = transactionsQuery.data?.data ?? []
  const selectedTransaction =
    allTransactions.find((item) => item.id === selectedId) ??
    transactions.find((item) => item.id === selectedId) ??
    null

  const paid = allTransactions.filter((item) => item.status === 'lunas')
  const paidTotal = paid.reduce((total, item) => total + item.total, 0)
  const serviceCount = allTransactions.filter(
    (item) => item.type === 'servis',
  ).length
  const partCount = allTransactions.filter(
    (item) => item.type === 'barang',
  ).length

  const byMethod = new Map<PaymentMethod, number>()
  for (const item of paid) {
    byMethod.set(item.payment_method, (byMethod.get(item.payment_method) ?? 0) + item.total)
  }
  const paymentBreakdown = [...byMethod.entries()]
    .map(([method, amount]) => ({
      method,
      amount,
      percent:
        paidTotal > 0
          ? Number(((amount / paidTotal) * 100).toFixed(1))
          : 0,
    }))
    .sort((left, right) => right.amount - left.amount)

  const largest = allTransactions.reduce<Transaction | null>(
    (biggest, item) => (!biggest || item.total > biggest.total ? item : biggest),
    null,
  )

  function resetFilters() {
    setQuery('')
    setActiveTab('Semua')
  }

  async function markPaid(transaction: Transaction) {
    setPendingId(transaction.id)
    try {
      await api.patch(`/transactions/${transaction.id}/payment`, {
        status: 'lunas',
      })
      allTransactionsQuery.refetch()
      transactionsQuery.refetch()
      setNotice({
        tone: 'success',
        message: `Nota ${transaction.id} ditandai lunas.`,
      })
    } catch (caught) {
      setNotice({
        tone: 'danger',
        message:
          caught instanceof ApiError
            ? caught.message
            : 'Status pembayaran gagal diubah.',
      })
    } finally {
      setPendingId(null)
    }
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
        <Notice tone={notice.tone} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Notice>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Lunas"
          value={formatCompactRupiah(paidTotal)}
          hint={`${paid.length} nota lunas`}
          icon={Wallet}
        />
        <StatCard
          label="Total Transaksi"
          value={String(allTransactions.length)}
          hint="Semua jenis"
          icon={ReceiptText}
        />
        <StatCard
          label="Servis"
          value={String(serviceCount)}
          hint="Nota servis"
          icon={Wrench}
          tone="success"
        />
        <StatCard
          label="Penjualan Barang"
          value={String(partCount)}
          hint="Nota barang"
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
                Transaksi Terbaru
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Semua nota, terbaru di atas
              </p>
            </div>
            <Badge tone="neutral">
              {transactionsQuery.loading
                ? 'Memuat…'
                : `${transactions.length} nota`}
            </Badge>
          </CardHeader>

          {transactionsQuery.error ? (
            <ErrorState
              message={transactionsQuery.error.message}
              onRetry={transactionsQuery.refetch}
            />
          ) : transactionsQuery.loading && !transactionsQuery.data ? (
            <LoadingState label="Memuat transaksi…" />
          ) : transactions.length === 0 ? (
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
                  {transactions.map((transaction) => {
                    const typeMeta = transactionTypeLabels[transaction.type]
                    const statusMeta = paymentStatusLabels[transaction.status]
                    return (
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
                          <p className="text-xs text-muted">
                            {formatTime(transaction.occurred_at)}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-xs text-ink">
                          {transaction.customer.name}
                        </td>
                        <td className="px-3 py-3">
                          <Badge tone={typeMeta.tone}>{typeMeta.label}</Badge>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted">
                          {paymentMethodLabels[transaction.payment_method]}
                        </td>
                        <td className="px-3 py-3 text-xs font-medium text-ink">
                          {formatRupiah(transaction.total)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Badge tone={statusMeta.tone}>
                            {statusMeta.label}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <p className="text-xs text-muted">
              Menampilkan {transactions.length} dari{' '}
              {transactionsQuery.data?.meta.total ?? 0} transaksi
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
                <p className="mt-0.5 text-xs text-muted">Nota lunas</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {paymentBreakdown.length === 0 ? (
                <p className="text-xs text-muted">Belum ada pembayaran lunas.</p>
              ) : (
                paymentBreakdown.map((method) => (
                  <div key={method.method}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">
                        {paymentMethodLabels[method.method]}
                      </span>
                      <span className="text-muted">
                        {formatRupiah(method.amount)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full bg-brand/60"
                        style={{ width: `${method.percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      {method.percent}% dari total lunas
                    </p>
                  </div>
                ))
              )}
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
                <p className="text-sm font-medium text-ink">
                  {largest?.customer.name ?? '—'}
                </p>
              </div>
            </div>
            <p className="mt-3 font-display text-2xl text-ink">
              {largest ? formatRupiah(largest.total) : '—'}
            </p>
            <p className="mt-1 text-xs text-muted">
              {largest
                ? `${largest.items[0]?.description ?? 'Tanpa item'} · ${largest.id} · ${paymentMethodLabels[largest.payment_method]}`
                : 'Belum ada transaksi.'}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              disabled={!largest}
              onClick={() => {
                if (largest) setSelectedId(largest.id)
              }}
            >
              Buka nota
            </Button>
          </Card>

          <p className="px-1 text-xs text-muted">
            Klik baris transaksi untuk membuka detail nota. Data tersimpan di
            mock backend selama halaman belum dimuat ulang.
          </p>
        </div>
      </div>

      {selectedTransaction ? (
        <Drawer
          open
          onClose={() => setSelectedId(null)}
          title={`Nota ${selectedTransaction.id}`}
          description={`${selectedTransaction.customer.name} · ${formatDate(selectedTransaction.occurred_at)} ${formatTime(selectedTransaction.occurred_at)}`}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Tutup
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setNotice({
                      tone: 'success',
                      message: `Nota ${selectedTransaction.id} siap dicetak (simulasi).`,
                    })
                  }
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Cetak
                </Button>
                {selectedTransaction.status === 'lunas' ? (
                  <Badge tone="success">Lunas</Badge>
                ) : (
                  <Button
                    disabled={pendingId === selectedTransaction.id}
                    onClick={() => markPaid(selectedTransaction)}
                  >
                    {pendingId === selectedTransaction.id
                      ? 'Menyimpan…'
                      : 'Tandai lunas'}
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
                <Badge
                  tone={paymentStatusLabels[selectedTransaction.status].tone}
                >
                  {paymentStatusLabels[selectedTransaction.status].label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted">Pelanggan</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedTransaction.customer.name}
                </p>
              </div>
              <div>
                <p className="text-muted">Jenis</p>
                <p className="mt-0.5 font-medium text-ink">
                  {transactionTypeLabels[selectedTransaction.type].label}
                </p>
              </div>
              <div>
                <p className="text-muted">Metode</p>
                <p className="mt-0.5 font-medium text-ink">
                  {paymentMethodLabels[selectedTransaction.payment_method]}
                </p>
              </div>
              <div>
                <p className="text-muted">Kasir</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedTransaction.cashier_name}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Rincian item</h3>
              <div className="mt-2 divide-y divide-line rounded-control border border-line">
                {selectedTransaction.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
                  >
                    <span className="min-w-0 flex-1 text-ink">
                      {item.description}
                      <span className="ml-1 text-muted">×{item.qty}</span>
                    </span>
                    <span className="shrink-0 text-ink">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-xs font-medium text-ink">Total</span>
                  <span className="text-sm font-medium text-brand-deep">
                    {formatRupiah(selectedTransaction.total)}
                  </span>
                </div>
              </div>
            </div>

            <p className="rounded-control bg-canvas px-3 py-2 text-[11px] leading-relaxed text-muted">
              Nota ini hanya contoh tampilan. Pajak dan diskon belum dihitung
              otomatis oleh backend.
            </p>
          </div>
        </Drawer>
      ) : null}
    </div>
  )
}
