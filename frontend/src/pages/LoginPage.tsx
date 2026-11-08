import { ArrowRight, Bike, Boxes, LockKeyhole, ShieldCheck, Wrench } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { appName, appSubtitle } from '../lib/navigation'

const highlights = [
  {
    icon: Wrench,
    title: 'Bengkel & work order',
    description: 'Kelola estimasi, pengerjaan, dan riwayat servis.',
  },
  {
    icon: Bike,
    title: 'Showroom motor',
    description: 'Pantau unit tersedia, reserved, dan terjual.',
  },
  {
    icon: Boxes,
    title: 'Stok sparepart',
    description: 'Kontrol saldo stok dan peringatan stok menipis.',
  },
]

export function LoginPage() {
  const [email, setEmail] = useState('owner@garasihobby.id')
  const [password, setPassword] = useState('demo1234')
  const [remember, setRemember] = useState(true)
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-svh bg-canvas text-ink">
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-ink p-10 text-canvas lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-light/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-3">
          <span className="rounded-control bg-brand/20 p-2.5 text-brand-light">
            <Bike className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl leading-tight text-white">{appName}</p>
            <p className="text-[11px] uppercase tracking-widest text-canvas/50">
              {appSubtitle}
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-light">
            Satu tempat, semua operasional
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-white">
            Showroom dan bengkel, rapi dalam satu sistem.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-canvas/70">
            Catat servis, jual motor, dan pantau stok tanpa pindah aplikasi.
            Dirancang untuk dipakai cepat dari meja kasir maupun ponsel.
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-control bg-white/10 p-2 text-brand-light">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-canvas/60">{item.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-canvas/40">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Akses owner · data operasional terlindungi</span>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="rounded-control bg-brand/15 p-2 text-brand-deep">
              <Bike className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg leading-tight text-ink">{appName}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                {appSubtitle}
              </p>
            </div>
          </div>

          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-deep">
            Masuk ke akun
          </p>
          <h2 className="mt-2 font-display text-3xl text-ink">Selamat datang kembali</h2>
          <p className="mt-2 text-sm text-muted">
            Gunakan akun owner untuk mengelola bengkel, showroom, dan stok.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Email atau nama pengguna
              </label>
              <input
                id="email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-control border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-medium text-ink">
                  Kata sandi
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-brand-deep hover:text-brand"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-control border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-line accent-[#d97706]"
              />
              Ingat saya di perangkat ini
            </label>

            <Button type="submit" className="w-full">
              Masuk
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-6 rounded-card border border-dashed border-line bg-surface/60 px-4 py-3">
            <p className="text-xs font-medium text-ink">Mode template statis</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Tombol masuk langsung membuka dashboard. Data dan tombol lain hanya
              ilustrasi, belum terhubung ke backend.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            <span className="font-medium text-ink">Owner</span> · Akses penuh ke seluruh
            modul
          </p>
        </div>
      </main>
    </div>
  )
}
