import {
  BarChart3,
  Bike,
  Boxes,
  LayoutDashboard,
  Palette,
  ReceiptText,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  description: string
}

export const appName = 'Garasi Hobby'
export const appSubtitle = 'Sistem Operasional'

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Ringkasan pendapatan, work order, showroom, dan stok.',
  },
  {
    label: 'Bengkel',
    path: '/workshop',
    icon: Wrench,
    description: 'Work order, estimasi, pengerjaan, dan transaksi servis.',
  },
  {
    label: 'Showroom',
    path: '/showroom',
    icon: Bike,
    description: 'Inventaris motor, foto, status, dan penjualan.',
  },
  {
    label: 'Stok',
    path: '/stock',
    icon: Boxes,
    description: 'Barang, saldo stok, pergerakan, dan stok menipis.',
  },
  {
    label: 'Transaksi',
    path: '/transactions',
    icon: ReceiptText,
    description: 'Servis, penjualan barang, penjualan motor, dan nota.',
  },
  {
    label: 'Pelanggan & Motor',
    path: '/customers',
    icon: Users,
    description: 'Data pelanggan, motor, dan histori layanan.',
  },
  {
    label: 'Laporan',
    path: '/reports',
    icon: BarChart3,
    description: 'Penjualan, servis, stok, dan estimasi profit.',
  },
  {
    label: 'Pengaturan',
    path: '/settings',
    icon: Settings,
    description: 'Identitas bisnis, pengguna, dan metode pembayaran.',
  },
]

export const mobileNavPaths = [
  '/dashboard',
  '/workshop',
  '/showroom',
  '/transactions',
]

export const designBoardItem: NavItem = {
  label: 'Design Board',
  path: '/design-board',
  icon: Palette,
  description: 'Palet warna, tipografi, komponen, dan indeks layar.',
}

