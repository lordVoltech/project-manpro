import {
  Bike,
  ChevronRight,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  EmptyState,
  PageHeader,
  SearchField,
  StatCard,
  type BadgeTone,
} from '../components/ui'

type Vehicle = {
  name: string
  plate: string
  lastService: string
}

type ServiceHistory = {
  date: string
  service: string
  total: string
  status: 'Selesai' | 'Berlangsung'
}

type Customer = {
  initials: string
  name: string
  phone: string
  email: string
  address: string
  memberSince: string
  vehicles: Vehicle[]
  history: ServiceHistory[]
  lastVisit: string
  totalSpend: string
  tag: string
}

const historyTone: Record<ServiceHistory['status'], BadgeTone> = {
  Selesai: 'success',
  Berlangsung: 'warning',
}

const customers: Customer[] = [
  {
    initials: 'BS',
    name: 'Budi Santoso',
    phone: '0812-3456-7890',
    email: 'budi.santoso@email.com',
    address: 'Jl. Melati No. 12, Jakarta Selatan',
    memberSince: 'Januari 2024',
    vehicles: [
      {
        name: 'Honda Beat',
        plate: 'B 1234 XYZ',
        lastService: 'Hari ini · servis rutin',
      },
    ],
    history: [
      {
        date: '9 Nov 2026',
        service: 'Servis rutin, ganti oli, rem depan',
        total: 'Rp 185.000',
        status: 'Berlangsung',
      },
      {
        date: '12 Sep 2026',
        service: 'Ganti oli dan cek tekanan angin',
        total: 'Rp 75.000',
        status: 'Selesai',
      },
      {
        date: '3 Jul 2026',
        service: 'Ganti kampas rem belakang',
        total: 'Rp 145.000',
        status: 'Selesai',
      },
    ],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 2.450.000',
    tag: 'Servis rutin',
  },
  {
    initials: 'SA',
    name: 'Siti Aminah',
    phone: '0857-1122-3344',
    email: 'siti.aminah@email.com',
    address: 'Jl. Kenanga No. 5, Depok',
    memberSince: 'Maret 2024',
    vehicles: [
      {
        name: 'Yamaha NMAX',
        plate: 'D 5678 ABC',
        lastService: 'Hari ini · inspeksi CVT',
      },
    ],
    history: [
      {
        date: '9 Nov 2026',
        service: 'Inspeksi CVT dan penggantian V-Belt',
        total: 'Rp 320.000',
        status: 'Berlangsung',
      },
      {
        date: '20 Aug 2026',
        service: 'Servis rutin 10.000 km',
        total: 'Rp 210.000',
        status: 'Selesai',
      },
    ],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 3.150.000',
    tag: 'Servis rutin',
  },
  {
    initials: 'RH',
    name: 'Rudi Hartono',
    phone: '0813-9988-7766',
    email: 'rudi.hartono@email.com',
    address: 'Jl. Anggrek No. 44, Bekasi',
    memberSince: 'November 2023',
    vehicles: [
      {
        name: 'Honda Vario 125',
        plate: 'F 9021 KL',
        lastService: 'Hari ini · ganti kampas rem',
      },
      {
        name: 'Honda Beat',
        plate: 'B 8899 AA',
        lastService: '18 Okt 2026 · servis rutin',
      },
    ],
    history: [
      {
        date: '9 Nov 2026',
        service: 'Ganti kampas rem belakang',
        total: 'Rp 145.000',
        status: 'Selesai',
      },
      {
        date: '18 Okt 2026',
        service: 'Servis rutin Honda Beat',
        total: 'Rp 95.000',
        status: 'Selesai',
      },
      {
        date: '2 Sep 2026',
        service: 'Ganti oli Vario 125',
        total: 'Rp 75.000',
        status: 'Selesai',
      },
    ],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 4.780.000',
    tag: 'Pelanggan setia',
  },
  {
    initials: 'DL',
    name: 'Dewi Lestari',
    phone: '0821-4455-6677',
    email: 'dewi.lestari@email.com',
    address: 'Jl. Cempaka No. 8, Tangerang',
    memberSince: 'Februari 2025',
    vehicles: [
      {
        name: 'Yamaha Aerox 155',
        plate: 'B 4455 QQ',
        lastService: 'Hari ini · pembelian motor',
      },
    ],
    history: [
      {
        date: '9 Nov 2026',
        service: 'Pembelian Yamaha Aerox 155 (2022)',
        total: 'Rp 27.500.000',
        status: 'Selesai',
      },
      {
        date: '14 Jun 2026',
        service: 'Servis besar 20.000 km',
        total: 'Rp 540.000',
        status: 'Selesai',
      },
    ],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 6.200.000',
    tag: 'Pembeli motor',
  },
  {
    initials: 'AS',
    name: 'Agus Setiawan',
    phone: '0819-2233-4455',
    email: 'agus.setiawan@email.com',
    address: 'Jl. Dahlia No. 21, Bogor',
    memberSince: 'April 2025',
    vehicles: [
      {
        name: 'Honda Scoopy',
        plate: 'B 7788 TT',
        lastService: '7 Nov 2026 · servis ringan',
      },
    ],
    history: [
      {
        date: '7 Nov 2026',
        service: 'Servis ringan dan setel karburator',
        total: 'Rp 95.000',
        status: 'Selesai',
      },
    ],
    lastVisit: '7 Nov 2026',
    totalSpend: 'Rp 1.120.000',
    tag: 'Servis rutin',
  },
  {
    initials: 'NK',
    name: 'Nina Kartika',
    phone: '0838-6677-8899',
    email: 'nina.kartika@email.com',
    address: 'Jl. Mawar No. 3, Depok',
    memberSince: 'Oktober 2026',
    vehicles: [
      {
        name: 'Yamaha Mio',
        plate: 'B 3322 RR',
        lastService: '5 Nov 2026 · ganti oli',
      },
    ],
    history: [
      {
        date: '5 Nov 2026',
        service: 'Ganti oli dan cek tekanan angin',
        total: 'Rp 75.000',
        status: 'Selesai',
      },
    ],
    lastVisit: '5 Nov 2026',
    totalSpend: 'Rp 890.000',
    tag: 'Baru',
  },
]

const brandShare = [
  { label: 'Honda', value: 168 },
  { label: 'Yamaha', value: 121 },
  { label: 'Lainnya', value: 12 },
]

const topCustomers = [
  { name: 'Dewi Lestari', amount: 'Rp 6.200.000' },
  { name: 'Rudi Hartono', amount: 'Rp 4.780.000' },
  { name: 'Siti Aminah', amount: 'Rp 3.150.000' },
]

export function CustomersPage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const navigate = useNavigate()

  const totalVehicles = brandShare.reduce((sum, brand) => sum + brand.value, 0)

  const selectedCustomer =
    customers.find((customer) => customer.name === selectedId) ?? null

  const normalizedQuery = query.trim().toLowerCase()
  const filteredCustomers = customers.filter((customer) =>
    normalizedQuery.length === 0
      ? true
      : [
          customer.name,
          customer.phone,
          customer.email,
          customer.address,
          ...customer.vehicles.map((vehicle) => `${vehicle.name} ${vehicle.plate}`),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
  )

  function createOrder(customer: Customer) {
    const firstVehicle = customer.vehicles[0]
    const params = new URLSearchParams({
      new: '1',
      customer: customer.name,
      phone: customer.phone,
      vehicle: firstVehicle?.name ?? '',
      plate: firstVehicle?.plate ?? '',
    })

    navigate(`/workshop?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pelanggan & Motor"
        description="Data pelanggan, motor terdaftar, dan histori layanan."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Users className="h-4 w-4" aria-hidden="true" />
              Impor data
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah pelanggan
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Pelanggan"
          value="248"
          hint="Terdaftar"
          icon={Users}
        />
        <StatCard
          label="Pelanggan Baru"
          value="18"
          hint="Bulan ini"
          icon={UserPlus}
          tone="success"
        />
        <StatCard
          label="Motor Terdaftar"
          value="301"
          hint="Honda terbanyak"
          icon={Bike}
          tone="brand"
        />
        <StatCard
          label="Servis Berulang"
          value="64%"
          hint="Datang lebih dari sekali"
          icon={Wallet}
          tone="neutral"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Cari nama, telepon, atau plat motor"
          label="Cari pelanggan"
          className="flex-1 sm:max-w-sm"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setQuery('')}
          className="self-start sm:self-auto"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Reset pencarian
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {filteredCustomers.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Pelanggan tidak ditemukan"
              description="Coba cari dengan nama lain, nomor telepon, atau plat motor."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuery('')}
                >
                  Reset pencarian
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredCustomers.map((customer) => (
                <Card key={customer.name} className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">
                      {customer.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">
                          {customer.name}
                        </p>
                        <Badge
                          tone={customer.tag === 'Baru' ? 'info' : 'neutral'}
                        >
                          {customer.tag}
                        </Badge>
                      </div>
                      <div className="mt-1 space-y-0.5 text-xs text-muted">
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" aria-hidden="true" />
                          {customer.phone}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" aria-hidden="true" />
                          <span className="truncate">{customer.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 border-t border-line pt-3">
                    {customer.vehicles.map((vehicle) => (
                      <p
                        key={vehicle.plate}
                        className="flex items-center gap-1.5 text-xs text-brand-deep"
                      >
                        <Bike
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          {vehicle.name} · {vehicle.plate}
                        </span>
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2 border-t border-line pt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">
                        Kunjungan terakhir
                      </p>
                      <p className="text-xs text-ink">{customer.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-muted">
                        Total belanja
                      </p>
                      <p className="text-sm font-medium text-ink">
                        {customer.totalSpend}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedId(customer.name)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
                  >
                    Lihat profil
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">
                  Sebaran Motor
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {totalVehicles} motor terdaftar
                </p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {brandShare.map((brand) => {
                const percent = Math.round((brand.value / totalVehicles) * 100)
                return (
                  <div key={brand.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">{brand.label}</span>
                      <span className="text-muted">
                        {brand.value} · {percent}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full bg-brand/60"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">
                  Pelanggan Teratas
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Total belanja tertinggi
                </p>
              </div>
            </CardHeader>
            <div className="divide-y divide-line">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand-deep">
                    {index + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-ink">
                    {customer.name}
                  </p>
                  <p className="text-xs font-medium text-ink">
                    {customer.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-card border border-dashed border-line bg-surface/60 px-4 py-3">
            <p className="text-xs font-medium text-ink">Histori layanan</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Buka profil pelanggan untuk melihat motor dan riwayat servis, lalu
              buat work order langsung dari panel.
            </p>
          </div>
        </div>
      </div>

      {selectedCustomer ? (
        <Drawer
          open
          onClose={() => setSelectedId(null)}
          title={selectedCustomer.name}
          description={`Pelanggan sejak ${selectedCustomer.memberSince}`}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                Tutup
              </Button>
              <Button onClick={() => createOrder(selectedCustomer)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Buat work order
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="space-y-1.5 rounded-control bg-canvas p-3 text-xs">
              <p className="flex items-center gap-2 text-ink">
                <Phone className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                {selectedCustomer.phone}
              </p>
              <p className="flex items-center gap-2 text-ink">
                <Mail className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                {selectedCustomer.email}
              </p>
              <p className="flex items-start gap-2 text-muted">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                {selectedCustomer.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted">Kunjungan terakhir</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedCustomer.lastVisit}
                </p>
              </div>
              <div>
                <p className="text-muted">Total belanja</p>
                <p className="mt-0.5 font-medium text-ink">
                  {selectedCustomer.totalSpend}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Motor terdaftar</h3>
              <div className="mt-2 space-y-2">
                {selectedCustomer.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.plate}
                    className="rounded-control border border-line px-3 py-2"
                  >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-ink">
                      <Bike
                        className="h-3.5 w-3.5 text-brand-deep"
                        aria-hidden="true"
                      />
                      {vehicle.name} · {vehicle.plate}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {vehicle.lastService}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-ink">Histori servis</h3>
              <div className="mt-2 divide-y divide-line rounded-control border border-line">
                {selectedCustomer.history.map((entry) => (
                  <div key={`${entry.date}-${entry.service}`} className="px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-ink">
                        {entry.service}
                      </p>
                      <Badge tone={historyTone[entry.status]}>
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted">
                      <span>{entry.date}</span>
                      <span className="font-medium text-ink">{entry.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      ) : null}
    </div>
  )
}
