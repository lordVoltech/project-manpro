import {
  Bike,
  CalendarDays,
  Download,
  Filter,
  Fuel,
  Gauge,
  MapPin,
  Plus,
  Search,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  PageHeader,
  StatCard,
  type BadgeTone,
} from '../components/ui'

type UnitStatus = 'Tersedia' | 'Reserved' | 'Terjual'

const statusTone: Record<UnitStatus, BadgeTone> = {
  Tersedia: 'success',
  Reserved: 'info',
  Terjual: 'neutral',
}

const filters: Array<UnitStatus | 'Semua'> = ['Semua', 'Tersedia', 'Reserved', 'Terjual']

const units: Array<{
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
}> = [
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
  },
]

export function ShowroomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Showroom"
        description="Inventaris motor, status unit, dan harga penawaran."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              Ekspor data
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah motor
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Total Unit" value="6" hint="Semua status" icon={Bike} />
        <StatCard
          label="Tersedia"
          value="4 unit"
          hint="Siap dijual"
          icon={Gauge}
          tone="success"
        />
        <StatCard
          label="Reserved"
          value="1 unit"
          hint="Menunggu pembayaran"
          icon={CalendarDays}
          tone="neutral"
        />
        <StatCard
          label="Terjual Bulan Ini"
          value="3 unit"
          hint="Nilai Rp 68,2 jt"
          icon={Fuel}
          tone="brand"
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
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Cari motor atau plat"
              className="w-full rounded-control border border-line bg-canvas py-2 pl-9 pr-3 text-xs text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <Button variant="secondary" size="sm" aria-label="Filter lanjutan">
            <Filter className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => (
          <Card key={unit.id} className="overflow-hidden">
            <div
              className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${unit.accent}`}
            >
              <Bike className="h-20 w-20 text-ink/15" aria-hidden="true" />
              <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted">
                {unit.id}
              </span>
              <Badge tone={statusTone[unit.status]} className="absolute right-3 top-3">
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
                  <p className="text-base font-medium text-brand-deep">{unit.price}</p>
                </div>
                <Button variant="secondary" size="sm">
                  Lihat detail
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted">
        Foto motor masih berupa placeholder. Nanti bisa diganti dengan foto asli unit
        dari galeri showroom.
      </p>
    </div>
  )
}
