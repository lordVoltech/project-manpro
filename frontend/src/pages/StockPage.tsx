import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Download,
  Package,
  Plus,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { api } from '../api'
import type {
  ListResponse,
  Part,
  StockMovement,
  StockStatus,
} from '../api/types'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  ErrorState,
  FilterChips,
  LoadingState,
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
import { movementTypeLabels, stockStatusLabels } from '../lib/labels'

type StockFilter = 'Semua' | 'Aman' | 'Menipis' | 'Habis'

const filters: StockFilter[] = ['Semua', 'Aman', 'Menipis', 'Habis']

const statusByFilter: Record<Exclude<StockFilter, 'Semua'>, StockStatus> = {
  Aman: 'aman',
  Menipis: 'menipis',
  Habis: 'habis',
}

function stockValue(parts: Part[]) {
  return parts.reduce((total, part) => total + part.average_cost * part.stock_qty, 0)
}

function categorySummary(parts: Part[]) {
  const groups = new Map<string, { stock: number; min: number }>()

  for (const part of parts) {
    const current = groups.get(part.category) ?? { stock: 0, min: 0 }
    current.stock += part.stock_qty
    current.min += part.min_qty
    groups.set(part.category, current)
  }

  return [...groups.entries()]
    .map(([label, group]) => ({
      label,
      value:
        group.min > 0 ? Math.min(100, Math.round((group.stock / group.min) * 100)) : 0,
    }))
    .sort((left, right) => left.value - right.value)
    .slice(0, 4)
}

export function StockPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StockFilter>('Semua')
  const debouncedQuery = useDebouncedValue(query.trim())

  const statusParam =
    statusFilter === 'Semua' ? undefined : statusByFilter[statusFilter]

  const allPartsQuery = useApiQuery(
    () =>
      api.get<ListResponse<Part>>('/stock/parts', {
        query: { per_page: 100 },
      }),
    [],
  )

  const partsQuery = useApiQuery(
    () =>
      api.get<ListResponse<Part>>('/stock/parts', {
        query: {
          per_page: 100,
          status: statusParam,
          q: debouncedQuery || undefined,
        },
      }),
    [statusParam, debouncedQuery],
  )

  const movementsQuery = useApiQuery(
    () =>
      api.get<ListResponse<StockMovement>>('/stock/movements', {
        query: { per_page: 6 },
      }),
    [],
  )

  const allParts = allPartsQuery.data?.data ?? []
  const parts = partsQuery.data?.data ?? []
  const movements = movementsQuery.data?.data ?? []

  const lowStock = allParts.filter((part) => part.status !== 'aman')
  const lowStockCount = lowStock.length
  const emptyCount = allParts.filter((part) => part.status === 'habis').length
  const categories = categorySummary(allParts)

  function resetFilters() {
    setQuery('')
    setStatusFilter('Semua')
  }

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
        <StatCard
          label="Total Item"
          value={String(allParts.length)}
          hint="Semua kategori"
          icon={Boxes}
        />
        <StatCard
          label="Nilai Stok"
          value={formatCompactRupiah(stockValue(allParts))}
          hint="Harga beli rata-rata"
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="Stok Menipis"
          value={`${lowStockCount - emptyCount} item`}
          hint="Di bawah minimum"
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Stok Habis"
          value={`${emptyCount} item`}
          hint="Perlu dibeli"
          icon={Package}
          tone="neutral"
        />
      </div>

      {lowStockCount > 0 ? (
        <div className="flex flex-col gap-3 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-amber-900">
                {lowStockCount} barang perlu perhatian
              </p>
              <p className="text-xs text-amber-800">
                {lowStock.map((part) => part.name).join(', ')}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="shrink-0">
            Buat permintaan pembelian
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={filters}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Cari barang, SKU, atau kategori"
          label="Cari barang"
          className="sm:w-64"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <h2 className="font-display text-lg text-ink">Daftar Barang</h2>
              <p className="mt-0.5 text-xs text-muted">
                Urut dari stok terendah
              </p>
            </div>
            <Badge tone="neutral">
              {partsQuery.loading ? 'Memuat…' : `${parts.length} barang`}
            </Badge>
          </CardHeader>

          {partsQuery.error ? (
            <ErrorState
              message={partsQuery.error.message}
              onRetry={partsQuery.refetch}
            />
          ) : partsQuery.loading && !partsQuery.data ? (
            <LoadingState label="Memuat daftar barang…" />
          ) : parts.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Package}
                title="Barang tidak ditemukan"
                description="Coba kata kunci lain atau tampilkan semua status stok."
                action={
                  <Button variant="secondary" size="sm" onClick={resetFilters}>
                    Reset filter
                  </Button>
                }
              />
            </div>
          ) : (
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
                  {parts.map((part) => {
                    const meta = stockStatusLabels[part.status]
                    return (
                      <tr
                        key={part.sku}
                        className="transition-colors hover:bg-canvas/60"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-ink">{part.name}</p>
                          <p className="text-xs text-muted">{part.sku}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted">
                          {part.category}
                        </td>
                        <td className="px-3 py-3">
                          <p
                            className={
                              part.status === 'habis'
                                ? 'text-sm font-medium text-red-700'
                                : part.status === 'menipis'
                                  ? 'text-sm font-medium text-amber-700'
                                  : 'text-sm font-medium text-ink'
                            }
                          >
                            {part.stock_qty} pcs
                          </p>
                          <p className="text-[11px] text-muted">
                            min. {part.min_qty}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-xs text-ink">
                          {formatRupiah(part.sale_price)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Badge tone={meta.tone}>{meta.label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">
                  Pergerakan Terbaru
                </h2>
                <p className="mt-0.5 text-xs text-muted">Terakhir dicatat</p>
              </div>
            </CardHeader>

            {movementsQuery.error ? (
              <ErrorState
                message={movementsQuery.error.message}
                onRetry={movementsQuery.refetch}
              />
            ) : movementsQuery.loading && !movementsQuery.data ? (
              <LoadingState label="Memuat pergerakan…" />
            ) : movements.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-muted">
                Belum ada pergerakan stok.
              </p>
            ) : (
              <div className="divide-y divide-line">
                {movements.map((movement) => {
                  const incoming = movement.type !== 'out'
                  return (
                    <div
                      key={movement.id}
                      className="flex items-start gap-3 px-5 py-3.5"
                    >
                      <span
                        className={
                          incoming
                            ? 'mt-0.5 rounded-control bg-emerald-50 p-1.5 text-emerald-700'
                            : 'mt-0.5 rounded-control bg-red-50 p-1.5 text-red-700'
                        }
                      >
                        {incoming ? (
                          <ArrowUpRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowDownRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {movement.part_name}
                        </p>
                        <p className="text-xs text-muted">
                          {movementTypeLabels[movement.type]}
                          {movement.reference ? ` · ${movement.reference}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={
                            incoming
                              ? 'text-sm font-medium text-emerald-700'
                              : 'text-sm font-medium text-red-700'
                          }
                        >
                          {incoming ? '+' : '−'}
                          {movement.qty}
                        </p>
                        <p className="text-[11px] text-muted">
                          {formatDate(movement.occurred_at)}{' '}
                          {formatTime(movement.occurred_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
              {categories.length === 0 ? (
                <p className="text-xs text-muted">Belum ada data kategori.</p>
              ) : (
                categories.map((category) => (
                  <div key={category.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">{category.label}</span>
                      <span className="font-medium text-ink">
                        {category.value}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full bg-brand/60"
                        style={{ width: `${category.value}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
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
