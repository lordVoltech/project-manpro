import {
  Bike,
  ChevronRight,
  Filter,
  Mail,
  Phone,
  Search,
  UserPlus,
  Users,
  Wallet,
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

const customers: Array<{
  initials: string
  name: string
  phone: string
  email: string
  vehicles: string[]
  lastVisit: string
  totalSpend: string
  tag: string
}> = [
  {
    initials: 'BS',
    name: 'Budi Santoso',
    phone: '0812-3456-7890',
    email: 'budi.santoso@email.com',
    vehicles: ['Honda Beat · B 1234 XYZ'],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 2.450.000',
    tag: 'Servis rutin',
  },
  {
    initials: 'SA',
    name: 'Siti Aminah',
    phone: '0857-1122-3344',
    email: 'siti.aminah@email.com',
    vehicles: ['Yamaha NMAX · D 5678 ABC'],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 3.150.000',
    tag: 'Servis rutin',
  },
  {
    initials: 'RH',
    name: 'Rudi Hartono',
    phone: '0813-9988-7766',
    email: 'rudi.hartono@email.com',
    vehicles: ['Honda Vario 125 · F 9021 KL', 'Honda Beat · B 8899 AA'],
    lastVisit: 'Hari ini',
    totalSpend: 'Rp 4.780.000',
    tag: 'Pelanggan setia',
  },
  {
    initials: 'DL',
    name: 'Dewi Lestari',
    phone: '0821-4455-6677',
    email: 'dewi.lestari@email.com',
    vehicles: ['Yamaha Aerox · B 4455 QQ'],
    lastVisit: '8 Nov 2026',
    totalSpend: 'Rp 6.200.000',
    tag: 'Pembeli motor',
  },
  {
    initials: 'AS',
    name: 'Agus Setiawan',
    phone: '0819-2233-4455',
    email: 'agus.setiawan@email.com',
    vehicles: ['Honda Scoopy · B 7788 TT'],
    lastVisit: '7 Nov 2026',
    totalSpend: 'Rp 1.120.000',
    tag: 'Servis rutin',
  },
  {
    initials: 'NK',
    name: 'Nina Kartika',
    phone: '0838-6677-8899',
    email: 'nina.kartika@email.com',
    vehicles: ['Yamaha Mio · B 3322 RR'],
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
  const totalVehicles = brandShare.reduce((sum, brand) => sum + brand.value, 0)

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
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Tambah pelanggan
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Total Pelanggan" value="248" hint="Terdaftar" icon={Users} />
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
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Cari nama, telepon, atau plat motor"
            className="w-full rounded-control border border-line bg-canvas py-2 pl-9 pr-3 text-xs text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filter pelanggan
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2">
          {customers.map((customer) => (
            <Card key={customer.name} className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">
                  {customer.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{customer.name}</p>
                    <Badge tone={customer.tag === 'Baru' ? 'info' : 'neutral'}>
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
                    key={vehicle}
                    className="flex items-center gap-1.5 text-xs text-brand-deep"
                  >
                    <Bike className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{vehicle}</span>
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
                  <p className="text-sm font-medium text-ink">{customer.totalSpend}</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
              >
                Lihat profil
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h2 className="font-display text-lg text-ink">Sebaran Motor</h2>
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
                <h2 className="font-display text-lg text-ink">Pelanggan Teratas</h2>
                <p className="mt-0.5 text-xs text-muted">Total belanja tertinggi</p>
              </div>
            </CardHeader>
            <div className="divide-y divide-line">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand-deep">
                    {index + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-ink">
                    {customer.name}
                  </p>
                  <p className="text-xs font-medium text-ink">{customer.amount}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-card border border-dashed border-line bg-surface/60 px-4 py-3">
            <p className="text-xs font-medium text-ink">Histori layanan</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Detail pelanggan dan riwayat servis akan tampil sebagai panel di halaman
              ini, bukan halaman terpisah.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
