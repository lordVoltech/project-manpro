import { Bike, Download, Filter, Fuel, Gauge, MapPin, Plus } from 'lucide-react'
import { useState } from 'react'
import { api, ApiError } from '../api'
import type {
  ListResponse,
  ShowroomUnit,
  UnitStatus,
} from '../api/types'
import {
  Badge,
  Button,
  Card,
  CardBody,
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
  formatDate,
  formatNumber,
  formatRupiah,
} from '../lib/format'
import { unitStatusLabels } from '../lib/labels'

type UnitFilter = 'Semua' | 'Tersedia' | 'Reserved' | 'Terjual'

const filters: UnitFilter[] = ['Semua', 'Tersedia', 'Reserved', 'Terjual']

const statusByFilter: Record<Exclude<UnitFilter, 'Semua'>, UnitStatus> = {
  Tersedia: 'tersedia',
  Reserved: 'reserved',
  Terjual: 'terjual',
}

const accentByStatus: Record<UnitStatus, string> = {
  tersedia: 'from-stone-200 to-stone-100',
  reserved: 'from-amber-100 to-stone-100',
  terjual: 'from-emerald-100 to-stone-100',
}

type NoticeState = { tone: 'success' | 'danger'; message: string }

export function ShowroomPage() {
  const [activeFilter, setActiveFilter] = useState<UnitFilter>('Semua')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const debouncedQuery = useDebouncedValue(query.trim())

  const statusParam =
    activeFilter === 'Semua' ? undefined : statusByFilter[activeFilter]

  const allUnitsQuery = useApiQuery(
    () =>
      api.get<ListResponse<ShowroomUnit>>('/showroom/units', {
        query: { per_page: 100 },
      }),
    [],
  )

  const unitsQuery = useApiQuery(
    () =>
      api.get<ListResponse<ShowroomUnit>>('/showroom/units', {
        query: {
          per_page: 100,
          status: statusParam,
          q: debouncedQuery || undefined,
        },
      }),
    [statusParam, debouncedQuery],
  )

  const allUnits = allUnitsQuery.data?.data ?? []
  const units = unitsQuery.data?.data ?? []
  const selectedUnit =
    allUnits.find((unit) => unit.id === selectedId) ??
    units.find((unit) => unit.id === selectedId) ??
    null

  const availableCount = allUnits.filter(
    (unit) => unit.status === 'tersedia',
  ).length
  const reservedCount = allUnits.filter(
    (unit) => unit.status === 'reserved',
  ).length
  const soldCount = allUnits.filter((unit) => unit.status === 'terjual').length

  function resetFilters() {
    setQuery('')
    setActiveFilter('Semua')
  }

  async function updateStatus(unit: ShowroomUnit, status: UnitStatus) {
    setPendingId(unit.id)
    try {
      await api.patch(`/showroom/units/${unit.id}`, { status })
      allUnitsQuery.refetch()
      unitsQuery.refetch()
      setNotice({
        tone: 'success',
        message: `Status ${unit.model_name} (${unit.plate_number}) diubah menjadi ${unitStatusLabels[status].label}.`,
      })
    } catch (caught) {
      setNotice({
        tone: 'danger',
        message:
          caught instanceof ApiError
            ? caught.message
            : 'Status unit gagal diubah.',
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Showroom"
        description="Inventaris motor, status unit, dan harga penawaran."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              <Filter className="h-4 w-4" aria-hidden="true" />
              Reset filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah motor
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
          label="Total Unit"
          value={String(allUnits.length)}
          hint="Semua status"
          icon={Bike}
        />
        <StatCard
          label="Tersedia"
          value={`${availableCount} unit`}
          hint="Siap dijual"
          icon={Gauge}
          tone="success"
        />
        <StatCard
          label="Reserved"
          value={`${reservedCount} unit`}
          hint="Menunggu pembayaran"
          icon={MapPin}
          tone="neutral"
        />
        <StatCard
          label="Terjual"
          value={`${soldCount} unit`}
          hint="Tercatat di transaksi"
          icon={Fuel}
          tone="brand"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={filters}
          value={activeFilter}
          onChange={setActiveFilter}
        />
        <div className="flex items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Cari motor atau plat"
            label="Cari motor"
            className="flex-1 sm:w-56"
          />
          <Button variant="secondary" size="sm" aria-label="Unduh data showroom">
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {unitsQuery.error ? (
        <ErrorState
          message={unitsQuery.error.message}
          onRetry={unitsQuery.refetch}
        />
      ) : unitsQuery.loading && !unitsQuery.data ? (
        <LoadingState label="Memuat unit showroom…" />
      ) : units.length === 0 ? (
        <EmptyState
          icon={Bike}
          title="Motor tidak ditemukan"
          description="Coba kata kunci lain atau tampilkan semua status unit."
          action={
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Reset filter
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {units.map((unit) => {
            const meta = unitStatusLabels[unit.status]
            return (
              <Card key={unit.id} className="overflow-hidden">
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${accentByStatus[unit.status]}`}
                >
                  <Bike className="h-20 w-20 text-ink/15" aria-hidden="true" />
                  <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted">
                    {unit.id}
                  </span>
                  <Badge tone={meta.tone} className="absolute right-3 top-3">
                    {meta.label}
                  </Badge>
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] text-muted">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {unit.location}
                  </span>
                </div>

                <CardBody className="space-y-3">
                  <div>
                    <h2 className="font-display text-lg leading-tight text-ink">
                      {unit.model_name}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted">
                      {unit.year} · {unit.plate_number}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatNumber(unit.mileage_km)} km
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5" aria-hidden="true" />
                      {unit.fuel_type}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-2 border-t border-line pt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">
                        Harga
                      </p>
                      <p className="text-base font-medium text-brand-deep">
                        {formatRupiah(unit.price)}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedId(unit.id)}
                    >
                      Lihat detail
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      {selectedUnit ? (
        <Drawer
          open
          onClose={() => setSelectedId(null)}
          title={selectedUnit.model_name}
          description={`${selectedUnit.year} · ${selectedUnit.plate_number}`}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Tutup
              </Button>
              {selectedUnit.status === 'tersedia' ? (
                <Button
                  disabled={pendingId === selectedUnit.id}
                  onClick={() => updateStatus(selectedUnit, 'reserved')}
                >
                  {pendingId === selectedUnit.id
                    ? 'Menyimpan…'
                    : 'Tandai reserved'}
                </Button>
              ) : selectedUnit.status === 'reserved' ? (
                <Button
                  variant="secondary"
                  disabled={pendingId === selectedUnit.id}
                  onClick={() => updateStatus(selectedUnit, 'tersedia')}
                >
                  {pendingId === selectedUnit.id
                    ? 'Menyimpan…'
                    : 'Batalkan reservasi'}
                </Button>
              ) : (
                <Badge tone="success">Terjual</Badge>
              )}
            </div>
          }
        >
          <div className="space-y-5">
            <div
              className={`relative flex aspect-[16/9] items-center justify-center rounded-card bg-gradient-to-br ${accentByStatus[selectedUnit.status]}`}
            >
              <Bike className="h-24 w-24 text-ink/15" aria-hidden="true" />
              <Badge
                tone={unitStatusLabels[selectedUnit.status].tone}
                className="absolute right-3 top-3"
              >
                {unitStatusLabels[selectedUnit.status].label}
              </Badge>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                Harga penawaran
              </p>
              <p className="mt-0.5 font-display text-2xl text-brand-deep">
                {formatRupiah(selectedUnit.price)}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {selectedUnit.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-control bg-canvas p-3 text-xs">
              <div>
                <p className="text-muted">Tahun</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.year}
                </p>
              </div>
              <div>
                <p className="text-muted">Plat nomor</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.plate_number}
                </p>
              </div>
              <div>
                <p className="text-muted">Kilometer</p>
                <p className="mt-0.5 font-medium text-ink">
                  {formatNumber(selectedUnit.mileage_km)} km
                </p>
              </div>
              <div>
                <p className="text-muted">Bahan bakar</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.fuel_type}
                </p>
              </div>
              <div>
                <p className="text-muted">Warna</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.color}
                </p>
              </div>
              <div>
                <p className="text-muted">Mesin</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.engine_cc} cc
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Pajak & dokumen</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Pajak hidup sampai {formatDate(selectedUnit.tax_valid_until)}.
                Unit terdaftar sejak {formatDate(selectedUnit.listed_at)}.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Catatan unit</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {selectedUnit.notes ?? 'Belum ada catatan untuk unit ini.'}
              </p>
            </div>

            <p className="rounded-control bg-canvas px-3 py-2 text-[11px] leading-relaxed text-muted">
              Penjualan unit dicatat melalui menu Transaksi, supaya stok dan
              laporan tetap konsisten. Dari sini status hanya bisa diubah antara
              tersedia dan reserved.
            </p>
          </div>
        </Drawer>
      ) : null}
    </div>
  )
}
