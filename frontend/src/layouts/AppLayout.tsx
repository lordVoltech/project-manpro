import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from '../components/layout/AppSidebar'
import { AppTopbar } from '../components/layout/AppTopbar'
import { MobileNav } from '../components/layout/MobileNav'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-svh bg-canvas text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 sm:px-6 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <MobileNav
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  )
}
