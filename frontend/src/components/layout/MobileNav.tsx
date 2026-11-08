import { Bike, MoreHorizontal, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { appName, designBoardItem, mobileNavPaths, navItems } from '../../lib/navigation'

type MobileNavProps = {
  menuOpen: boolean
  onOpenMenu: () => void
  onClose: () => void
}

export function MobileNav({ menuOpen, onOpenMenu, onClose }: MobileNavProps) {
  const primaryItems = navItems.filter((item) =>
    mobileNavPaths.includes(item.path),
  )
  const DesignBoardIcon = designBoardItem.icon

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Navigasi bawah"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
          {primaryItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] transition-colors',
                    isActive ? 'text-brand-deep' : 'text-muted',
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          <button
            type="button"
            onClick={onOpenMenu}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] transition-colors',
              menuOpen ? 'text-brand-deep' : 'text-muted',
            )}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>Lainnya</span>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            aria-label="Tutup menu"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu utama"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink p-4 text-canvas shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 px-1 py-2">
              <div className="flex items-center gap-3">
                <span className="rounded-control bg-brand/15 p-2 text-brand-light">
                  <Bike className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-display text-lg text-white">{appName}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-control p-2 text-canvas/70 hover:bg-white/10 hover:text-white"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              className="mt-4 flex-1 space-y-1 overflow-y-auto"
              aria-label="Navigasi seluler"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-control border-l-2 border-transparent px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'border-brand-light bg-white/10 text-white'
                          : 'text-canvas/70 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            <div className="border-t border-white/10 pt-3">
              <NavLink
                to={designBoardItem.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-control border-l-2 border-transparent px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'border-brand-light bg-white/10 text-white'
                      : 'text-canvas/50 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <DesignBoardIcon className="h-4 w-4" aria-hidden="true" />
                <span>{designBoardItem.label}</span>
              </NavLink>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-[11px] uppercase tracking-widest text-canvas/40">
                Masuk sebagai
              </p>
              <p className="mt-1 text-sm text-white">Pak Arif</p>
              <p className="text-xs text-canvas/50">Owner · Akses penuh</p>
              <NavLink
                to="/login"
                onClick={onClose}
                className="mt-4 inline-flex text-xs font-medium text-brand-light hover:text-white"
              >
                Keluar dari akun
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
