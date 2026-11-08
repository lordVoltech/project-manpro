import { Bike } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { appName, appSubtitle, designBoardItem, navItems } from '../../lib/navigation'

export function AppSidebar() {
  const DesignBoardIcon = designBoardItem.icon

  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-white/10 bg-ink text-canvas lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="rounded-control bg-brand/15 p-2 text-brand-light">
          <Bike className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-tight text-white">
            {appName}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-canvas/60">
            {appSubtitle}
          </p>
        </div>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-2"
        aria-label="Navigasi utama"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
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

      <div className="border-t border-white/10 px-3 py-2">
        <NavLink
          to={designBoardItem.path}
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

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] uppercase tracking-widest text-canvas/40">
          Masuk sebagai
        </p>
        <p className="mt-1 text-sm text-white">Pak Arif</p>
        <p className="text-xs text-canvas/50">Owner · Akses penuh</p>
      </div>
    </aside>
  )
}
