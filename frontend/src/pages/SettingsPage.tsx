import {
  Bell,
  Building2,
  Check,
  CreditCard,
  Plus,
  Save,
  ShieldCheck,
  Users,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  type BadgeTone,
} from '../components/ui'

type Role = 'Owner' | 'Mekanik' | 'Kasir'

const roleTone: Record<Role, BadgeTone> = {
  Owner: 'warning',
  Mekanik: 'info',
  Kasir: 'neutral',
}

const team: Array<{
  initials: string
  name: string
  email: string
  role: Role
  status: string
}> = [
  {
    initials: 'PA',
    name: 'Pak Arif',
    email: 'owner@garasihobby.id',
    role: 'Owner',
    status: 'Aktif',
  },
  {
    initials: 'SL',
    name: 'Slamet',
    email: 'slamet@garasihobby.id',
    role: 'Mekanik',
    status: 'Aktif',
  },
  {
    initials: 'JK',
    name: 'Joko',
    email: 'joko@garasihobby.id',
    role: 'Mekanik',
    status: 'Aktif',
  },
  {
    initials: 'ST',
    name: 'Siti',
    email: 'siti@garasihobby.id',
    role: 'Kasir',
    status: 'Nonaktif',
  },
]

const paymentMethods = [
  { label: 'Tunai', description: 'Pembayaran di kasir', active: true },
  { label: 'Transfer bank', description: 'BCA · 1234567890', active: true },
  { label: 'QRIS', description: 'Semua e-wallet', active: true },
  { label: 'Kartu debit/kredit', description: 'Mesin EDC', active: false },
]

const preferences = [
  { label: 'Notifikasi stok menipis', description: 'Tampilkan peringatan di dashboard', checked: true },
  { label: 'Ringkasan harian', description: 'Kirim rekap via WhatsApp setiap pukul 20.00', checked: true },
  { label: 'Cetak nota otomatis', description: 'Langsung buka dialog cetak setelah transaksi', checked: false },
]

function Switch({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      role="switch"
      aria-checked={active}
      aria-label={label}
      className={
        active
          ? 'inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-brand p-0.5'
          : 'inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-stone-300 p-0.5'
      }
    >
      <span
        className={
          active
            ? 'ml-auto h-5 w-5 rounded-full bg-white shadow-sm'
            : 'h-5 w-5 rounded-full bg-white shadow-sm'
        }
      />
    </span>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Identitas bisnis, pengguna, metode pembayaran, dan preferensi."
        actions={
          <Button size="sm">
            <Save className="h-4 w-4" aria-hidden="true" />
            Simpan perubahan
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg text-ink">Identitas Bisnis</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Tampil pada nota dan laporan
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="business-name"
                  className="mb-1.5 block text-xs font-medium text-ink"
                >
                  Nama bisnis
                </label>
                <input
                  id="business-name"
                  type="text"
                  defaultValue="Garasi Hobby"
                  className="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label
                  htmlFor="business-phone"
                  className="mb-1.5 block text-xs font-medium text-ink"
                >
                  Telepon / WhatsApp
                </label>
                <input
                  id="business-phone"
                  type="tel"
                  defaultValue="0812-9000-1234"
                  className="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="business-address"
                className="mb-1.5 block text-xs font-medium text-ink"
              >
                Alamat
              </label>
              <textarea
                id="business-address"
                rows={2}
                defaultValue="Jl. Raya Motor No. 88, Jakarta Selatan"
                className="w-full resize-none rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="business-hours"
                  className="mb-1.5 block text-xs font-medium text-ink"
                >
                  Jam operasional
                </label>
                <input
                  id="business-hours"
                  type="text"
                  defaultValue="08.00 – 20.00"
                  className="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label
                  htmlFor="business-email"
                  className="mb-1.5 block text-xs font-medium text-ink"
                >
                  Email bisnis
                </label>
                <input
                  id="business-email"
                  type="email"
                  defaultValue="halo@garasihobby.id"
                  className="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg text-ink">Pengguna & Peran</h2>
                <p className="mt-0.5 text-xs text-muted">Akses tim</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" aria-label="Tambah pengguna">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardHeader>
          <div className="divide-y divide-line">
            {team.map((member) => (
              <div key={member.email} className="flex items-center gap-3 px-5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{member.name}</p>
                  <p className="truncate text-[11px] text-muted">{member.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge tone={roleTone[member.role]}>{member.role}</Badge>
                  <p className="mt-1 text-[10px] text-muted">{member.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-3">
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-deep" aria-hidden="true" />
              Owner memiliki akses penuh ke semua modul.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg text-ink">Metode Pembayaran</h2>
                <p className="mt-0.5 text-xs text-muted">Aktif di halaman transaksi</p>
              </div>
            </div>
          </CardHeader>
          <div className="divide-y divide-line">
            {paymentMethods.map((method) => (
              <div key={method.label} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{method.label}</p>
                  <p className="text-xs text-muted">{method.description}</p>
                </div>
                <Switch active={method.active} label={`Aktifkan ${method.label}`} />
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-deep hover:text-brand"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Tambah metode pembayaran
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg text-ink">Preferensi</h2>
                <p className="mt-0.5 text-xs text-muted">Notifikasi dan perilaku aplikasi</p>
              </div>
            </div>
          </CardHeader>
          <div className="divide-y divide-line">
            {preferences.map((preference) => (
              <div key={preference.label} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{preference.label}</p>
                  <p className="text-xs text-muted">{preference.description}</p>
                </div>
                <span
                  className={
                    preference.checked
                      ? 'grid h-5 w-5 shrink-0 place-items-center rounded bg-brand text-white'
                      : 'grid h-5 w-5 shrink-0 place-items-center rounded border border-line bg-canvas'
                  }
                >
                  {preference.checked ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-3">
            <p className="text-xs text-muted">
              Pengaturan belum tersimpan. Ini hanya tampilan template.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
