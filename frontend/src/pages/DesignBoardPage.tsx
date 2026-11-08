import {
  ArrowRight,
  BarChart3,
  Bike,
  Boxes,
  Check,
  Component,
  LayoutDashboard,
  LogIn,
  Monitor,
  Palette,
  ReceiptText,
  Settings,
  Smartphone,
  Type,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
} from '../components/ui'

const palette = [
  { name: 'Canvas', hex: '#F6F3EC', swatch: 'bg-canvas', border: true },
  { name: 'Surface', hex: '#FFFEFA', swatch: 'bg-surface', border: true },
  { name: 'Ink', hex: '#2D3130', swatch: 'bg-ink', border: false },
  { name: 'Muted', hex: '#60594F', swatch: 'bg-muted', border: false },
  { name: 'Line', hex: '#E0D9CC', swatch: 'bg-line', border: true },
  { name: 'Brand', hex: '#D97706', swatch: 'bg-brand', border: false },
  { name: 'Brand Light', hex: '#F59E0B', swatch: 'bg-brand-light', border: false },
  { name: 'Brand Deep', hex: '#78350F', swatch: 'bg-brand-deep', border: false },
]

const screens: Array<{
  name: string
  path: string
  description: string
  icon: LucideIcon
  status: 'Selesai' | 'Placeholder'
}> = [
  {
    name: 'Login',
    path: '/login',
    description: 'Masuk owner dengan panel brand dan formulir statis.',
    icon: LogIn,
    status: 'Selesai',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    description: 'Statistik hari ini, work order aktif, penjualan, dan stok menipis.',
    icon: LayoutDashboard,
    status: 'Selesai',
  },
  {
    name: 'Bengkel',
    path: '/workshop',
    description: 'Daftar work order, beban mekanik, dan sparepart ditunggu.',
    icon: Wrench,
    status: 'Selesai',
  },
  {
    name: 'Showroom',
    path: '/showroom',
    description: 'Grid inventaris motor dengan status dan harga.',
    icon: Bike,
    status: 'Selesai',
  },
  {
    name: 'Stok',
    path: '/stock',
    description: 'Tabel barang, peringatan stok, dan pergerakan terbaru.',
    icon: Boxes,
    status: 'Selesai',
  },
  {
    name: 'Transaksi',
    path: '/transactions',
    description: 'Nota servis, barang, dan motor dengan ringkasan pembayaran.',
    icon: ReceiptText,
    status: 'Selesai',
  },
  {
    name: 'Pelanggan & Motor',
    path: '/customers',
    description: 'Kartu pelanggan, motor terdaftar, dan pelanggan teratas.',
    icon: Users,
    status: 'Selesai',
  },
  {
    name: 'Laporan',
    path: '/reports',
    description: 'Pendapatan harian, komposisi, margin, dan produk terlaris.',
    icon: BarChart3,
    status: 'Selesai',
  },
  {
    name: 'Pengaturan',
    path: '/settings',
    description: 'Identitas bisnis, tim, metode pembayaran, dan preferensi.',
    icon: Settings,
    status: 'Selesai',
  },
  {
    name: 'Design Board',
    path: '/design-board',
    description: 'Palet, tipografi, komponen, dan indeks seluruh layar.',
    icon: Palette,
    status: 'Selesai',
  },
]

const principles = [
  {
    title: 'Mobile-first',
    description:
      'Aksi utama dapat dijangkau dengan satu tangan. Bottom nav untuk empat modul tersibuk.',
  },
  {
    title: 'Cepat di kasir',
    description:
      'Informasi penting diletakkan di atas: status, total, dan aksi berikutnya.',
  },
  {
    title: 'Tenang dan jelas',
    description:
      'Warna cream, charcoal, dan amber dipakai hemat agar status mudah dibedakan.',
  },
]

export function DesignBoardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Design Board"
        description="Referensi visual template Garasi Hobby: warna, tipografi, komponen, dan layar."
        actions={
          <Badge tone="warning">10 layar</Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {principles.map((principle) => (
          <Card key={principle.title} className="p-5">
            <span className="grid h-9 w-9 place-items-center rounded-control bg-brand/10 text-brand-deep">
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-display text-base text-ink">{principle.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {principle.description}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-brand-deep" aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg text-ink">Palet Warna</h2>
              <p className="mt-0.5 text-xs text-muted">
                Token Tailwind: canvas, surface, ink, muted, line, brand
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {palette.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-control border border-line">
                <div
                  className={`h-16 ${color.swatch} ${color.border ? 'border-b border-line' : ''}`}
                />
                <div className="bg-surface px-3 py-2">
                  <p className="text-xs font-medium text-ink">{color.name}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg text-ink">Tipografi</h2>
                <p className="mt-0.5 text-xs text-muted">Fraunces untuk judul, Inter untuk isi</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                Display · Fraunces
              </p>
              <p className="mt-1 font-display text-3xl text-ink">Garasi Hobby</p>
              <p className="font-display text-lg text-ink">Operasional Showroom</p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="text-[10px] uppercase tracking-widest text-muted">
                Body · Inter
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                Servis masuk, penjualan motor, dan stok sparepart tercatat dalam satu
                alur kerja yang ringkas.
              </p>
              <p className="mt-2 text-xs text-muted">
                Label sekunder, keterangan tabel, dan bantuan formulir.
              </p>
            </div>
            <div className="rounded-control bg-canvas px-3 py-2">
              <p className="text-[11px] text-muted">
                Judul memakai kapital per kata · ukuran judul 18–30 px · teks isi 12–14 px
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Component className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg text-ink">Komponen</h2>
                <p className="mt-0.5 text-xs text-muted">Tombol, badge, dan kartu statistik</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-muted">
                Tombol
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Utama</Button>
                <Button variant="secondary" size="sm">
                  Sekunder
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
                <Button variant="danger" size="sm">
                  Hapus
                </Button>
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-muted">
                Badge status
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="neutral">Menunggu</Badge>
                <Badge tone="info">Inspeksi</Badge>
                <Badge tone="warning">Dikerjakan</Badge>
                <Badge tone="success">Lunas</Badge>
                <Badge tone="danger">Menipis</Badge>
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-muted">
                Radius & permukaan
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-16 flex-1 items-center justify-center rounded-control border border-line bg-canvas text-[11px] text-muted">
                  control · 10 px
                </div>
                <div className="flex h-16 flex-1 items-center justify-center rounded-card border border-line bg-surface text-[11px] text-muted">
                  card · 16 px
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2 className="font-display text-lg text-ink">Indeks Layar</h2>
            <p className="mt-0.5 text-xs text-muted">
              Sepuluh layar dalam cakupan MVP, termasuk Design Board
            </p>
          </div>
          <Badge tone="neutral">React Router</Badge>
        </CardHeader>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {screens.map((screen, index) => {
            const Icon = screen.icon
            return (
              <Link
                key={screen.path}
                to={screen.path}
                className="group flex flex-col rounded-control border border-line bg-canvas/40 p-4 transition-colors hover:border-brand/40 hover:bg-brand/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-control bg-ink text-brand-light">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-ink group-hover:text-brand-deep">
                  {screen.name}
                </p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-muted">
                  {screen.description}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-muted ring-1 ring-inset ring-line">
                    {screen.path}
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-brand-deep transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-brand-deep" aria-hidden="true" />
            <h2 className="font-display text-lg text-ink">Desktop</h2>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-muted">
            <li>Sidebar tetap 256 px dengan navigasi charcoal dan aksen amber.</li>
            <li>Topbar berisi judul halaman, notifikasi, dan profil owner.</li>
            <li>Konten dibatasi 1152 px agar tabel tetap nyaman dibaca.</li>
            <li>Breakpoint utama: 1024 px (lg) dan 1280 px (xl).</li>
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-brand-deep" aria-hidden="true" />
            <h2 className="font-display text-lg text-ink">Mobile</h2>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-muted">
            <li>Bottom nav: Dashboard, Bengkel, Showroom, Transaksi, Lainnya.</li>
            <li>Tombol Lainnya membuka drawer berisi seluruh menu dan profil.</li>
            <li>Tabel berubah menjadi kartu atau dapat digeser horizontal.</li>
            <li>Area konten memberi ruang untuk safe area dan bottom nav.</li>
          </ul>
        </Card>
      </div>

      <div className="rounded-card border border-dashed border-line bg-surface/60 px-4 py-3">
        <p className="text-xs text-muted">
          Design Board adalah layar referensi internal. Semua data, tombol, dan filter
          masih statis sampai tahap integrasi berikutnya.
        </p>
      </div>
    </div>
  )
}
