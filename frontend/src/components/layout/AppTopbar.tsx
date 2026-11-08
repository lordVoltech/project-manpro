import { Bell, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { appName, designBoardItem, navItems } from '../../lib/navigation'
import { Button } from '../ui/Button'

type AppTopbarProps = {
  onOpenMenu: () => void
}

export function AppTopbar({ onOpenMenu }: AppTopbarProps) {
  const { pathname } = useLocation()
  const current = [...navItems, designBoardItem].find((item) =>
    pathname.startsWith(item.path),
  )

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onOpenMenu}
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-[11px] uppercase tracking-widest text-muted lg:hidden">
            {appName}
          </p>
          <p className="truncate font-display text-lg text-ink">
            {current?.label ?? appName}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative rounded-control p-2 text-muted transition-colors hover:bg-canvas hover:text-ink"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
        </button>
        <div className="hidden items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 sm:flex">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
            PA
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium text-ink">Pak Arif</p>
            <p className="text-[10px] text-muted">Owner</p>
          </div>
        </div>
      </div>
    </header>
  )
}
