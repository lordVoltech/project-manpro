import { ArrowLeft, Bike } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand-deep">
        <Bike className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-6 font-display text-5xl text-ink">404</p>
      <h1 className="mt-2 font-display text-2xl text-ink">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Alamat yang Anda buka tidak ada atau sudah dipindahkan. Kembali ke dashboard
        untuk melanjutkan.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-control bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke dashboard
      </Link>
    </div>
  )
}
