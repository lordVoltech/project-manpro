import {
  Bike,
  Download,
  Filter,
  Fuel,
  Gauge,
  MapPin,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  Drawer,
  EmptyState,
  FilterChips,
  Notice,
  PageHeader,
  SearchField,
  StatCard,
  type BadgeTone,
} from '../components/ui'

type UnitStatus = 'Tersedia' | 'Reserved' | 'Terjual'

type ShowroomUnit = {
  id: string
  name: string
  year: string
  plate: string
  price: string
  status: UnitStatus
  mileage: string
  fuel: string
  location: string
  accent: string
  color: string
  engine: string
  tax: string
  notes: string
}

const statusTone: Record<UnitStatus, BadgeTone> = {
  Tersedia: 'success',
  Reserved: 'info',
  Terjual: 'neutral',
}

const filters: Array<UnitStatus | 'Semua'> = [
  'Semua',
  'Tersedia',
  'Reserved',
  'Terjual',
]

const initialUnits: ShowroomUnit[] = [
  {
    id: 'MTR-01',
    name: 'Yamaha NMAX 155',
    year: '2023',
    plate: 'B 1234 XYZ',
    price: 'Rp 27.500.000',
    status: 'Tersedia',
    mileage: '8.400 km',
    fuel: 'Bensin',
    location: 'Showroom A',
    accent: 'from-stone-200 to-stone-100',
    color: 'Hitam Doff',
    engine: '155 cc',
    tax: 'Pajak hidup s.d. Maret 2027',
    notes: 'Servis rutin lengkap, kunci ganda, ban masih tebal.',
  },
  {
    id: 'MTR-02',
    name: 'Honda Vario 160',
    year: '2024',
    plate: 'D 5678 ABC',
    price: 'Rp 24.000.000',
    status: 'Reserved',
    mileage: '3.100 km',
    fuel: 'Bensin',
    location: 'Showroom A',
    accent: 'from-amber-100 to-stone-100',
    color: 'Merah Matte',
    engine: '160 cc',
    tax: 'Pajak hidup s.d. Agustus 2027',
    notes: 'DP sudah diterima, menunggu pelunasan pembeli.',
  },
  {
    id: 'MTR-03',
    name: 'Honda PCX 160',
    year: '2022',
    plate: 'F 9021 KL',
    price: 'Rp 25.750.000',
    status: 'Tersedia',
    mileage: '12.600 km',
    fuel: 'Bensin',
    location: 'Showroom B',
    accent: 'from-sky-100 to-stone-100',
    color: 'Putih Pearl',
    engine: '160 cc',
    tax: 'Pajak hidup s.d. Januari 2027',
    notes: 'Satu tangan, riwayat servis tersedia, STNK lengkap.',
  },
  {
    id: 'MTR-04',
    name: 'Yamaha XMAX 250',
    year: '2023',
    plate: 'B 4455 QQ',
    price: 'Rp 42.000.000',
    status: 'Tersedia',
    mileage: '5.200 km',
    fuel: 'Bensin',
    location: 'Showroom B',
    accent: 'from-stone-300 to-stone-100',
    color: 'Silver',
    engine: '250 cc',
    tax: 'Pajak hidup s.d. Juni 2027',
    notes: 'Unit istimewa, kelengkapan lengkap, siap touring.',
  },
  {
    id: 'MTR-05',
    name: 'Honda Beat Street',
    year: '2021',
    plate: 'B 7788 TT',
    price: 'Rp 13.500.000',
    status: 'Terjual',
    mileage: '21.900 km',
    fuel: 'Bensin',
    location: 'Gudang',
    accent: 'from-emerald-100 to-stone-100',
    color: 'Hitam',
    engine: '110 cc',
    tax: 'Pajak hidup s.d. Oktober 2026',
    notes: 'Sudah terjual. Menunggu proses serah terima dokumen.',
  },
  {
    id: 'MTR-06',
    name: 'Yamaha Aerox 155',
    year: '2022',
    plate: 'B 3322 RR',
    price: 'Rp 22.800.000',
    status: 'Tersedia',
    mileage: '9.700 km',
    fuel: 'Bensin',
    location: 'Showroom A',
    accent: 'from-rose-100 to-stone-100',
    color: 'Biru Racing',
    engine: '155 cc',
    tax: 'Pajak hidup s.d. Desember 2026',
    notes: 'Body mulus, mesin sehat, sudah servis besar.',
  },
]

export function ShowroomPage() {
  const [units, setUnits] = useState<ShowroomUnit[]>(initialUnits)
  const [activeFilter, setActiveFilter] = useState<UnitStatus | 'Semua'>('Semua')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const selectedUnit = units.find((unit) => unit.id === selectedId) ?? null

  const normalizedQuery = query.trim().toLowerCase()
  const filteredUnits = units.filter((unit) => {
    const matchesFilter =
      activeFilter === 'Semua' || unit.status === activeFilter
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [unit.id, unit.name, unit.plate, unit.year, unit.location]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    return matchesFilter && matchesQuery
  })

  const availableCount = units.filter((unit) => unit.status === 'Tersedia').length
  const reservedCount = units.filter((unit) => unit.status === 'Reserved').length
  const soldCount = units.filter((unit) => unit.status === 'Terjual').length

  function resetFilters() {
    setQuery('')
    setActiveFilter('Semua')
  }

  function markSold(unit: ShowroomUnit) {
    setUnits((previous) =>
      previous.map((item) =>
        item.id === unit.id ? { ...item, status: 'Terjual' } : item,
      ),
    )
    setNotice(`Unit ${unit.name} (${unit.plate}) ditandai terjual (simulasi).`)
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
        <Notice tone="success" onDismiss={() => setNotice(null)}>
          {notice}
        </Notice>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Unit"
          value={String(units.length)}
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
          hint="Termasuk unit hari ini"
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

      {filteredUnits.length === 0 ? (
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
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="overflow-hidden">
              <div
                className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${unit.accent}`}
              >
                <Bike className="h-20 w-20 text-ink/15" aria-hidden="true" />
                <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted">
                  {unit.id}
                </span>
                <Badge
                  tone={statusTone[unit.status]}
                  className="absolute right-3 top-3"
                >
                  {unit.status}
                </Badge>
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] text-muted">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {unit.location}
                </span>
              </div>

              <CardBody className="space-y-3">
                <div>
                  <h2 className="font-display text-lg leading-tight text-ink">
                    {unit.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    {unit.year} · {unit.plate}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                    {unit.mileage}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Fuel className="h-3.5 w-3.5" aria-hidden="true" />
                    {unit.fuel}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2 border-t border-line pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      Harga
                    </p>
                    <p className="text-base font-medium text-brand-deep">
                      {unit.price}
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
          ))}
        </div>
      )}

      {selectedUnit ? (
        <Drawer
          open
          onClose={() => setSelectedId(null)}
          title={selectedUnit.name}
          description={`${selectedUnit.year} · ${selectedUnit.plate}`}
          footer={
            <div className="flex items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Tutup
              </Button>
              {selectedUnit.status === 'Terjual' ? (
                <Badge tone="success">Terjual</Badge>
              ) : (
                <Button onClick={() => markSold(selectedUnit)}>
                  Tandai terjual
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-5">
            <div
              className={`relative flex aspect-[16/9] items-center justify-center rounded-card bg-gradient-to-br ${selectedUnit.accent}`}
            >
              <Bike className="h-24 w-24 text-ink/15" aria-hidden="true" />
              <Badge
                tone={statusTone[selectedUnit.status]}
                className="absolute right-3 top-3"
              >
                {selectedUnit.status}
              </Badge>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                Harga penawaran
              </p>
              <p className="mt-0.5 font-display text-2xl text-brand-deep">
                {selectedUnit.price}
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
                  {selectedUnit.plate}
                </p>
              </div>
              <div>
                <p className="text-muted">Kilometer</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.mileage}
                </p>
              </div>
              <div>
                <p className="text-muted">Bahan bakar</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedUnit.fuel}
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
                  {selectedUnit.engine}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Pajak & dokumen</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {selectedUnit.tax}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Catatan unit</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {selectedUnit.notes}
              </p>
            </div>
          </div>
        </Drawer>
      ) : null}
    </div>
  )
}
